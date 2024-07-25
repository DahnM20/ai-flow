from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor

from openai import OpenAI

from .processor_type_name_utils import ProcessorType


class DallEPromptProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.DALLE_PROMPT

    DEFAULT_MODEL = "dall-e-3"
    DEFAULT_SIZE = "1024x1024"
    DEFAULT_QUALITY = "standard"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.prompt = config.get("prompt")
        self.size = config.get("size", DallEPromptProcessor.DEFAULT_SIZE)
        self.quality = config.get("quality", DallEPromptProcessor.DEFAULT_QUALITY)

    def process(self):
        if self.get_input_processor() is not None:
            self.prompt = (
                self.get_input_processor().get_output(self.get_input_node_output_key())
                if self.prompt is None or len(self.prompt) == 0
                else self.prompt
            )

        api_key = self._processor_context.get_value("openai_api_key")
        client = OpenAI(
            api_key=api_key,
        )

        response = client.images.generate(
            model=DallEPromptProcessor.DEFAULT_MODEL,
            prompt=self.prompt,
            n=1,
            size=self.size,
            quality=self.quality,
        )

        return response.data[0].url

    def cancel(self):
        pass
