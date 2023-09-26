from .processor import Processor

import openai


class DallEPromptProcessor(Processor):
    processor_type = "dalle-prompt"

    def __init__(self, config, api_context_data):
        super().__init__(config, api_context_data)
        self.prompt = config.get("prompt")
        self.size = config.get("size", "256x256")  # Default size is "256x256"
        self.api_key = self.get_api_key("session_openai_api_key")

    def process(self):
        self.prompt = (
            self.input_processor.get_output(self.input_key)
            if self.prompt is None or len(self.prompt) == 0
            else self.prompt
        )
        response = openai.Image.create(
            prompt=self.prompt,
            n=1,
            size=self.size,
            api_key=self.api_key,
        )
        self.set_output(response["data"][0]["url"])

        return self._output

    def updateContext(self, data):
        pass
