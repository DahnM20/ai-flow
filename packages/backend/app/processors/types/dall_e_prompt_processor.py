from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor

from openai import OpenAI

from .processor_type_name_utils import DALLE_PROMPT

class DallEPromptProcessor(APIContextProcessor):
    processor_type = DALLE_PROMPT
    
    DEFAULT_MODEL = "dall-e-3"
    DEFAULT_SIZE = "1024x1024"
    DEFAULT_QUALITY="standard"

    def __init__(self, config, api_context_data:ProcessorContext):
        super().__init__(config, api_context_data)
        self.prompt = config.get("prompt")
        self.size = config.get("size", DallEPromptProcessor.DEFAULT_SIZE)
        self.quality = config.get("quality", DallEPromptProcessor.DEFAULT_QUALITY)
        self.api_key = api_context_data.get_api_key_for_provider("openai")

    def process(self):
        if self.get_input_processor() is not None:
            self.prompt = (
                self.get_input_processor().get_output(self.get_input_node_output_key())
                if self.prompt is None or len(self.prompt) == 0
                else self.prompt
            )

        client = OpenAI(
            api_key=self.api_key,
        )
        
        response = client.images.generate(
            model=DallEPromptProcessor.DEFAULT_MODEL,
            prompt=self.prompt,
            n=1,
            size=self.size,
            quality=self.quality,
        )
        self.set_output(response.data[0].url)

        return self._output

    def updateContext(self, data):
        pass
