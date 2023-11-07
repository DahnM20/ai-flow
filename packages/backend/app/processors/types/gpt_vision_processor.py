from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor

from openai import OpenAI
from urllib.parse import urlparse

class GPTVisionProcessor(APIContextProcessor):
    processor_type = "gpt-vision"
    DEFAULT_MODEL = "gpt-4-vision-preview"

    def __init__(self, config, api_context_data: ProcessorContext):
        super().__init__(config, api_context_data)

        self.model = config.get("model", GPTVisionProcessor.DEFAULT_MODEL)
        self.prompt = config["prompt"]
        self.api_key = api_context_data.get_api_key_for_model(self.model)

    def process(self):
        input_image_url = None
        if self.get_input_processor() is not None:
            input_image_url = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )
        
        if self.prompt is None or len(self.prompt) == 0:
            return "No prompt provided."
            
        if input_image_url is None :
            return "No image provided."
        
        if not self.is_valid_url(input_image_url):
            return "Invalid URL provided."
        
        client = OpenAI(
            api_key=self.api_key,
        )
        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": input_image_url,
                        },
                        {
                            "type": "text",
                            "text": self.prompt,
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        
        answer = response.choices[0]
        messageContent = answer.message.content
        self.set_output(messageContent)
        return messageContent
    
    def is_valid_url(self, url):
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

    def updateContext(self, data):
        pass
