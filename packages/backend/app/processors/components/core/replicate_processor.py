import logging
from queue import Empty, Queue


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
from ....tasks.task_manager import add_task, register_task_processor
from ....tasks.task_utils import wait_for_result


class ReplicateProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.REPLICATE

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self._has_dynamic_behavior = True

        self.config = config
        self.model = config.get("model")

        if self.model is None:
            self.model = config.get("config").get("nodeName")

        model_name_withouth_version = self.model.split(":")[0]
        self.schema = get_model_openapi_schema(model_name_withouth_version)

    def get_prediction_result(
        self, prediction, timeout=3600.0, initial_sleep=0.1, max_sleep=5.0
    ):
        results_queue = Queue()
        add_task("replicate_prediction_wait", prediction, results_queue)

        try:
            prediction = wait_for_result(
                results_queue, timeout, initial_sleep, max_sleep
            )
        except TimeoutError as e:
            raise TimeoutError("Prediction result timed out")

        return prediction

    @staticmethod
    def wait_for_prediction_task(prediction):
        prediction.wait()
        return prediction

    def register_background_task(self):
        try:
            register_task_processor(
                "replicate_prediction_wait",
                self.wait_for_prediction_task,
                max_concurrent_tasks=10,
            )
        except TaskAlreadyRegisteredError as e:
            pass

    def process(self):
        input_processors = self.get_input_processors()
        input_output_keys = self.get_input_node_output_keys()
        input_names = self.get_input_names()

        if input_processors:
            for processor, name, key in zip(
                input_processors, input_names, input_output_keys
            ):
                output = processor.get_output(key)

                input_type = self._get_nested_input_schema_property(name, "type")

                if input_type == "integer":
                    output = int(output)
                if input_type == "number":
                    output = float(output)

                self.config[name] = output

        api = replicate.Client(
            api_token=self._processor_context.get_api_key_for_provider("replicate")
        )

        output_schema = get_output_schema_from_open_API_schema(self.schema["schema"])
        logging.debug(f"Output schema : {output_schema}")
        output_type = output_schema.get("type")
        output_array_display = output_schema.get("x-cog-array-display")

        rest, version_id = self.model.split(":")

        self.prediction = api.predictions.create(version=version_id, input=self.config)
        self.register_background_task()

        self.prediction = self.get_prediction_result(self.prediction)

        if self.prediction.status != "succeeded":
            exception = Exception(
                f" Replicate prediction failed with status : {self.prediction.status}"
            )
            exception.rollback_not_needed = True
            raise exception

        output = self.prediction.output

        if output_type == "array" and output_array_display == "concatenate":
            output = "".join(output)
        elif output_type == "array":
            # Do nothing
            output = output
        else:
            output = str(output)

        self.set_output(output)
        return self._output

    def _get_nested_input_schema_property(self, property_name, nested_key):
        return (
            get_input_schema_from_open_API_schema(self.schema.get("schema", {}))
            .get("properties", {})
            .get(property_name, {})
            .get(nested_key)
        )

    def cancel(self):
        api = replicate.Client(
            api_token=self._processor_context.get_api_key_for_provider("replicate")
        )
        api.predictions.cancel(id=self.prediction.id)
