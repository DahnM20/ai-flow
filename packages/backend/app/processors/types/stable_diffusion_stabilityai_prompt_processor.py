import base64

from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor
from datetime import datetime
import requests

import os


from .processor_type_name_utils import ProcessorType


class StableDiffusionStabilityAIPromptProcessor(APIContextProcessor):
    processor_type = ProcessorType.STABLE_DIFFUSION_STABILITYAI_PROMPT

    def __init__(self, config, api_context_data: ProcessorContext):
        super().__init__(config, api_context_data)
        self.prompt = config.get("prompt")

        size = config.get("size", "1024x1024")

        self.height = int(size.split("x")[0])
        self.width = int(size.split("x")[1])
        self.style_preset = config.get("style_preset", "")
        self.samples = 1
        self.engine_id = "stable-diffusion-xl-1024-v1-0"

        self.api_host = os.getenv(
            "STABLE_DIFFUSION_STABILITYAI_API_HOST", "https://api.stability.ai"
        )

    def prepare_and_process_response(self, response):
        if response.status_code != 200:
            raise Exception("Non-200 response: " + str(response.text))

        data = response.json()
        first_image = data["artifacts"][0]["base64"]
        image_data = base64.b64decode(first_image)

        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{self.name}-{timestamp_str}.png"
        url = storage.save(filename, image_data)

        self.set_output(url)
        return self._output

    def setup_data_to_send(self):
        self.api_key = self.api_context_data.get_api_key_for_provider("stabilityai")

        if self.get_input_processor() is not None:
            self.prompt = (
                self.get_input_processor().get_output(self.get_input_node_output_key())
                if self.prompt is None or len(self.prompt) == 0
                else self.prompt
            )

        data_to_send = {
            "text_prompts": [{"text": f"{self.prompt}"}],
            "cfg_scale": 7,
            "height": self.height,
            "width": self.width,
            "samples": self.samples,
            "steps": 30,
        }

        return data_to_send

    def process(self):
        data_to_send = self.setup_data_to_send()

        response = requests.post(
            f"{self.api_host}/v1/generation/{self.engine_id}/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            json=data_to_send,
        )

        return self.prepare_and_process_response(response)

    def cancel(self):
        pass

    def update_context(self, data):
        pass
