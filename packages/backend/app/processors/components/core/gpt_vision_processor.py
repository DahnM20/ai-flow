import logging
from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor
from .processor_type_name_utils import ProcessorType
from openai import OpenAI
from urllib.parse import urlparse


class GPTVisionProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.GPT_VISION
    DEFAULT_MODEL = "gpt-4-vision-preview"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

        self.model = config.get("model", GPTVisionProcessor.DEFAULT_MODEL)
        self.api_key = context.get_value("session_openai_api_key")

    def process(self):
        self.vision_inputs = {
            "prompt": self.get_input_by_name("prompt"),
            "image_url": self.get_input_by_name("image_url"),
        }

        if (
            self.vision_inputs["prompt"] is None
            or len(self.vision_inputs["prompt"]) == 0
        ):
            return "No prompt provided."

        if self.vision_inputs["image_url"] is None:
            return "No image provided."

        if not self.is_valid_url(self.vision_inputs["image_url"]):
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
                            "image_url": self.vision_inputs["image_url"],
                        },
                        {
                            "type": "text",
                            "text": self.vision_inputs["prompt"],
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

    def cancel(self):
        pass
