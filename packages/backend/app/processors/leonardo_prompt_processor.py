import requests
from .processor import Processor
import re

class LeonardoPromptProcessor(Processor):
    processor_type = "leonardo-prompt"
    default_size = (256, 256)

    def __init__(self, config):
        super().__init__(config)

        # Get config parameters with defaults
        self.prompt = config.get("prompt")
        self.size = config.get("size", "256x256")
        self.model = config.get("model", "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3")

        # Validate and split the size into width and height
        self.width, self.height = self._process_size()

    def _process_size(self):
        """Process the size parameter and split it into width and height."""
        if re.match(r'^\d+x\d+$', self.size):
            try:
                return map(int, self.size.split('x'))
            except ValueError:
                print(f"Error: Invalid number in size '{self.size}'.")
        else:
            print(f"Error: Invalid format for size '{self.size}'.")

        # Return default size in case of error
        return self.default_size

    def process(self):
        self.prompt = self.input_processor.get_output(self.input_key) if not self.prompt else self.prompt
        
        url = "https://cloud.leonardo.ai/api/rest/v1/generations"

        payload = {
            "prompt": self.prompt,
            "modelId": self.model,
            "width": self.width,
            "height": self.height
        }

        headers = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers)

        print(response.text)

        self.set_output(response.text)

        return self._output

    def updateContext(self, data):
        pass