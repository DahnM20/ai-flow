from ...launcher.event_type import EventType
from ...launcher.processor_event import ProcessorEvent
from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor
from .processor_type_name_utils import ProcessorType
from openai import OpenAI
from urllib.parse import urlparse


class GPTVisionProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.GPT_VISION
    DEFAULT_MODEL = "gpt-4o"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

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

        api_key = self._processor_context.get_value("openai_api_key")
        client = OpenAI(
            api_key=api_key,
        )
        response = client.chat.completions.create(
            model=GPTVisionProcessor.DEFAULT_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": self.vision_inputs["image_url"]},
                        },
                        {
                            "type": "text",
                            "text": self.vision_inputs["prompt"],
                        },
                    ],
                }
            ],
            max_tokens=300,
            stream=True,
        )

        final_response = ""
        for chunk in response:
            if not chunk.choices[0].delta.content:
                continue
            final_response += chunk.choices[0].delta.content
            event = ProcessorEvent(self, final_response)
            self.notify(EventType.STREAMING, event)

        return final_response

    def is_valid_url(self, url):
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

    def cancel(self):
        pass
