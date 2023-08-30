from .processor import Processor
import requests
import os


class StableDiffusionStabilityAIPromptProcessor(Processor):
    processor_type = "stable-diffusion-stabilityai-prompt"

    def __init__(self, config):
        super().__init__(config)
        self.prompt = config.get("prompt")
        self.height = int(config.get("height", "256"))
        self.width = int(config.get("width", "256"))
        self.style_preset = config.get("style_preset", "")
        self.samples = 1
        self.engine_id = "stable-diffusion-xl-1024-v1-0"

        self.api_host = os.getenv(
            "STABLE_DIFFUSION_STABILITYAI_API_HOST", "https://api.stability.ai"
        )

        self.api_key = self.get_api_key("session_stabilityai_api_key")

    def process(self):
        if getattr(self, "input_processor", None) is not None:
            self.prompt = (
                self.input_processor.get_output(self.input_key)
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

        response = requests.post(
            f"{self.api_host}/v1/generation/{self.engine_id}/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            json=data_to_send,
        )

        if response.status_code != 200:
            raise Exception("Non-200 response: " + str(response.text))

        data = response.json()
        first_image = data["artifacts"][0]["base64"]

        self.set_output(first_image)

        return self._output

    def updateContext(self, data):
        pass
