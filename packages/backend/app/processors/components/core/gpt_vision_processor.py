import re
from typing import Any, List

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

    def _gather_image_url_values(self) -> List[Any]:
        """
        Pull the value of `element` plus every `element_<n>` child field
        in the order they appear in self.fields_names.
        """
        # Match element_0, element_1, … whatever the UI generates
        child_pattern = re.compile(r"^image_url_\d+$")

        # Preserve original order: parent first, then the children
        ordered_field_names = [
            fname
            for fname in self.fields_names
            if fname == "image_url" or child_pattern.match(fname)
        ]

        values = [self.get_input_by_name(fname, None) for fname in ordered_field_names]
        return [v for v in values if v is not None]

    def process(self):
        self.vision_inputs = {
            "prompt": self.get_input_by_name("prompt"),
        }

        images_urls = self._gather_image_url_values()

        if (
            self.vision_inputs["prompt"] is None
            or len(self.vision_inputs["prompt"]) == 0
        ):
            raise ValueError("No prompt provided.")

        if len(images_urls) == 0:
            raise ValueError("No image provided.")

        for url in images_urls:
            if not self.is_valid_url(url):
                raise ValueError(f"Invalid URL provided. \n {url}")

        api_key = self._processor_context.get_value("openai_api_key")
        client = OpenAI(
            api_key=api_key,
        )
        content = []

        for image in images_urls:
            content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": image},
                }
            )

        content.append(
            {
                "type": "text",
                "text": self.vision_inputs["prompt"],
            }
        )

        response = client.chat.completions.create(
            model=GPTVisionProcessor.DEFAULT_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": content,
                }
            ],
            max_tokens=4096,
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
