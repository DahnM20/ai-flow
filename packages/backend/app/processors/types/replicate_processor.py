import os
from urllib.parse import urlparse
from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor
import replicate

from .processor_type_name_utils import REPLICATE


class StableVideoDiffusionReplicaterocessor(APIContextProcessor):
    processor_type = REPLICATE

    def __init__(self, config, api_context_data: ProcessorContext):
        super().__init__(config, api_context_data)

        self.config = config
        self.model = config.get("dynamicValues").get("dynamicNodeModel")

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

        output = api.run(
            self.model
            + ":bbb9acdbaeb0ea3ffa52a2102ec067c3329de677e17d6638e8a74243363f2fdc",
            input=self.config,
        )

        self.set_output(output)

        return self._output

    def updateContext(self, data):
        pass
