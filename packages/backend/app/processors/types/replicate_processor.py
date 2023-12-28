import logging

from ...utils.replicate_utils import (
    get_input_schema_from_open_API_schema,
    get_model_openapi_schema,
    get_output_schema_from_open_API_schema,
)
from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor
import replicate

from .processor_type_name_utils import REPLICATE


class ReplicateProcessor(APIContextProcessor):
    processor_type = REPLICATE

    def __init__(self, config, api_context_data: ProcessorContext):
        super().__init__(config, api_context_data)

        self.config = config
        self.model = config.get("config").get("nodeName")
        model_name_withouth_version = self.model.split(":")[0]
        logging.info(f"Model : {model_name_withouth_version}")
        self.schema = get_model_openapi_schema(model_name_withouth_version)

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

                self.config[name] = output

        api = replicate.Client(
            api_token=self.api_context_data.get_api_key_for_provider("replicate")
        )

        output_schema = get_output_schema_from_open_API_schema(self.schema["schema"])
        logging.debug(f"Output schema : {output_schema}")
        output_type = output_schema["type"]

        output = api.run(
            self.model,
            input=self.config,
        )

        if output_type == "array":
            output = "".join(output)

        self.set_output(output)
        return self._output

    def _get_nested_input_schema_property(self, property_name, nested_key):
        return (
            get_input_schema_from_open_API_schema(self.schema.get("schema", {}))
            .get("properties", {})
            .get(property_name, {})
            .get(nested_key)
        )

    def updateContext(self, data):
        pass
