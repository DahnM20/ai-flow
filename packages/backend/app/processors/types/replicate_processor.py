import logging

from ...utils.replicate_utils import get_model_openapi_schema
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
        inputs_processor = self.get_input_processors()
        inputs_output_keys = self.get_input_node_output_keys()
        inputs_names = self.get_input_names()

        for input_processor, input_name, output_key in zip(
            inputs_processor, inputs_names, inputs_output_keys
        ):
            output = input_processor.get_output(output_key)
            self.config[input_name] = output

        api = replicate.Client(
            api_token=self.api_context_data.get_api_key_for_provider("replicate")
        )

        output_schema = self.schema["outputSchema"]
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

    def updateContext(self, data):
        pass
