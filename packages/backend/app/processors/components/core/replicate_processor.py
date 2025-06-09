from datetime import datetime
import logging
from queue import Queue
import time
from urllib.parse import urlparse

from app.env_config import is_s3_enabled


from ...launcher.event_type import EventType
from ...launcher.processor_event import ProcessorEvent

from ....utils.processor_utils import stream_download_file_as_binary

from ...exceptions import LightException
from ....utils.replicate_utils import (
    get_input_schema_from_open_API_schema,
    get_model_openapi_schema,
    get_output_schema_from_open_API_schema,
)

from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor
import replicate
from .processor_type_name_utils import ProcessorType
from ....tasks.task_exception import TaskAlreadyRegisteredError
from ....tasks.thread_pool_task_manager import add_task, register_task_processor
from ....tasks.task_utils import wait_for_result


class ReplicateProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.REPLICATE

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.is_processing = False
        self.config = config
        self.model = config.get("model")

        if self.model is None:
            self.model = config.get("config").get("nodeName")

        if ":" not in self.model:
            logging.warning(f"Model {self.model} has no version")
            raise Exception(f"Cannot find version for this model : {self.model}.")

        self.model_name_withouth_version = self.model.split(":")[0]

    def get_prediction_result(
        self, prediction, processor, timeout=3600.0, initial_sleep=0.1, max_sleep=5.0
    ):
        results_queue = Queue()
        add_task("replicate_prediction_wait", (prediction, processor), results_queue)

        try:
            prediction = wait_for_result(
                results_queue, timeout, initial_sleep, max_sleep
            )
        except TimeoutError as e:
            raise TimeoutError("Prediction result timed out")

        return prediction

    @staticmethod
    def wait_for_prediction_task(task_data):
        prediction, processor = task_data
        while prediction.status not in ["succeeded", "failed", "canceled"]:
            time.sleep(prediction._client.poll_interval)
            if prediction.status == "processing":
                processor.is_processing = True
            prediction.reload()
        return prediction

    def register_background_task(self):
        try:
            register_task_processor(
                "replicate_prediction_wait",
                self.wait_for_prediction_task,
                max_concurrent_tasks=100,
            )
        except TaskAlreadyRegisteredError as e:
            pass

    def process(self):
        api_key = self._processor_context.get_value("replicate_api_key")

        self.schema = get_model_openapi_schema(self.model_name_withouth_version)
        input_processors = self.get_input_processors()
        input_output_keys = self.get_input_node_output_keys()
        input_names = self.get_input_names()

        if input_processors:
            for processor, name, key in zip(
                input_processors, input_names, input_output_keys
            ):
                output = processor.get_output(key)

                if output is None:
                    continue

                input_type = self._get_nested_input_schema_property(name, "type")

                if input_type == "integer":
                    output = int(output)
                if input_type == "number":
                    output = float(output)

                self.config[name] = output

        api = replicate.Client(api_token=api_key)

        output_schema = get_output_schema_from_open_API_schema(self.schema["schema"])
        logging.debug(f"Output schema : {output_schema}")
        output_type = output_schema.get("type")
        output_array_display = output_schema.get("x-cog-array-display")
        output_format = output_schema.get("format")

        if not ":" in self.model:
            logging.warning(f"Model {self.model} has no version")
            raise Exception("Cannot find version for this model")

        rest, version_id = self.model.split(":")

        self.config["disable_safety_checker"] = True

        try:
            self.prediction = api.predictions.create(
                version=version_id, input=self.config
            )
        except Exception as e:
            logging.warning(f"Error while creating prediction : {e}")
            raise LightException(
                "Please review your input to ensure it aligns with the expected format. \n\n"
                "For reference, you can review the examples here: \n"
                f"https://replicate.com/{self.model_name_withouth_version}/examples\n\n"
                f"Error message from Replicate: \n\n {e}"
            )

        self.register_background_task()

        self.prediction = self.get_prediction_result(self.prediction, self)

        if self.prediction.status != "succeeded":
            replicate_error_message = self.prediction.error
            message_str = f"Your Replicate prediction ended with status : {self.prediction.status} \n\n"

            if replicate_error_message and self.prediction.status != "canceled":
                message_str += (
                    f"There may be an issue with the parameters provided for the model '{self.model_name_withouth_version}'. \n\n"
                    "Please review your input to ensure it aligns with the expected format. \n\n"
                    "For reference, you can review the examples here: \n"
                    f"https://replicate.com/{self.model_name_withouth_version}/examples\n\n"
                    f"Error message from Replicate: {replicate_error_message}"
                )
            exception = Exception(message_str)
            exception.rollback_not_needed = True
            raise exception

        output = self.prediction.output
        self.metrics = self.prediction.metrics
        isUriOutput = output_format == "uri"

        if output_type == "array" and output_array_display == "concatenate":
            output = "".join(output)
        elif output_type == "array":
            items_type = output_schema.get("items").get("type")
            items_format = output_schema.get("items").get("format")
            isUriOutput = items_format == "uri"
            output = output
        elif output_type == "string":
            if isinstance(output, list):
                output = "".join(output)
        else:
            output = [output]

        event = ProcessorEvent(self, output)
        self.notify(EventType.STREAMING, event)

        if isUriOutput:
            if isinstance(output, list):
                new_output = []
                for uri in output:
                    new_uri = self.upload_replicate_uri_to_storage(uri)
                    new_output.append(new_uri)
                output = new_output
            else:
                output = self.upload_replicate_uri_to_storage(output)

        return output

    def upload_replicate_uri_to_storage(self, uri):
        if not is_s3_enabled():
            return uri

        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")

        extension = None
        try:
            parsed = urlparse(uri)
            path = parsed.path
            if "." in path:
                extension = path.split(".")[-1]
            else:
                logging.warning("No extension found in URI: %s", uri)
        except Exception as e:
            logging.warning("Error extracting extension from URI (%s): %s", uri, str(e))

        if not extension:
            logging.warning("Aborting Upload - No extension found in URI: %s", uri)
            return uri

        filename = f"{self.name}-{timestamp_str}.{extension}"
        file = stream_download_file_as_binary(uri)

        url = storage.save(filename, file)

        return url

    def _get_nested_input_schema_property(self, property_name, nested_key):
        return (
            get_input_schema_from_open_API_schema(self.schema.get("schema", {}))
            .get("properties", {})
            .get(property_name, {})
            .get(nested_key)
        )

    def cancel(self):
        api_key = self._processor_context.get_value("replicate_api_key")
        api = replicate.Client(api_token=api_key)
        api.predictions.cancel(id=self.prediction.id)
