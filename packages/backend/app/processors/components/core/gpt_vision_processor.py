import logging
from ...context.processor_context import ProcessorContext
from ..processor import APIContextProcessor
from .processor_type_name_utils import ProcessorType
from openai import OpenAI
from urllib.parse import urlparse


class GPTVisionProcessor(APIContextProcessor):
    processor_type = ProcessorType.GPT_VISION
    DEFAULT_MODEL = "gpt-4-vision-preview"

    def __init__(self, config, api_context_data: ProcessorContext):
        super().__init__(config, api_context_data)

        self.model = config.get("model", GPTVisionProcessor.DEFAULT_MODEL)
        self.api_key = api_context_data.get_api_key_for_model(self.model)

        self.vision_inputs = {
            "prompt": config.get("prompt"),
            "image_url": config.get("image_url"),
        }

    def process(self):
        input_processors = self.get_input_processors()
        input_output_keys = self.get_input_node_output_keys()
        input_names = self.get_input_names()

        if input_processors:
            for processor, name, key in zip(
                input_processors, input_names, input_output_keys
            ):
                output = processor.get_output(key)
                logging.info(output)
                self.vision_inputs[name] = output

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

    def update_context(self, data):
        pass
