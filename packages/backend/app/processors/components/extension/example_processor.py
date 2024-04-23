from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig
from .extension_base_processor import APIContextExtensionProcessor


class ExampleProcessor(APIContextExtensionProcessor):
    processor_type = "example-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.strength = config["strength"]

    def get_schema(self):
        urlInput = Field(
            name="url",
            label="url",
            type="input",
            required=True,
            placeholder="URLPlaceholder",
            hasHandle=True,
        )

        slider = Field(
            name="strength",
            label="strength",
            type="slider",
            min=1,
            max=10,
            required=False,
        )

        fields = [urlInput, slider]

        config = NodeConfig(
            nodeName="ExampleNode",
            processorType=self.processor_type,
            icon="FaLink",
            fields=fields,
            outputType="text",
            section="tools",
            helpMessage="urlInputHelp",
            hasInputHandle=True,
            showHandlesNames=True,
            inputNames=["url", "strength"],
        )

        return config

    def process(self):
        self.url = self.get_input_by_name("url")
        print(self._processor_context.get_parameter_names())
        print(self._processor_context.get_value("session_openai_api_key"))
        print(self._processor_context.get_value("session_number_1_api_key"))
        return f"Example {self.url} {self.strength}"

    def cancel(self):
        pass
