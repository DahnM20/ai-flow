import os
import requests
from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option
from .extension_processor import ContextAwareExtensionProcessor
from datetime import datetime


class StableDiffusionThreeProcessor(ContextAwareExtensionProcessor):
    processor_type = "stabilityai-stable-diffusion-3-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.api_host = os.getenv(
            "STABLE_DIFFUSION_STABILITYAI_API_HOST", "https://api.stability.ai"
        )

    def get_schema(self):
        prompt = Field(
            name="prompt",
            label="prompt",
            type="textfield",
            required=True,
            placeholder="InputTextPlaceholder",
            hasHandle=True,
        )

        negative_prompt = Field(
            name="negative_prompt",
            label="negative_prompt",
            type="textfield",
            placeholder="InputTextPlaceholder",
            hasHandle=True,
        )

        model_options = [
            Option(
                default=True,
                value="sd3",
                label="Stable Diffusion 3",
            ),
            Option(
                default=False,
                value="sd3-turbo",
                label="Stable Diffusion 3 Turbo",
            ),
        ]

        model = Field(name="model", label="model", type="select", options=model_options)

        aspect_ratio_options = [
            Option(
                default=True,
                value="1:1",
                label="1:1",
            ),
            Option(
                default=False,
                value="16:9",
                label="16:9",
            ),
            Option(
                default=False,
                value="3:2",
                label="3:2",
            ),
            Option(
                default=False,
                value="2:3",
                label="2:3",
            ),
            Option(
                default=False,
                value="4:5",
                label="4:5",
            ),
            Option(
                default=False,
                value="5:4",
                label="5:4",
            ),
            Option(
                default=False,
                value="9:16",
                label="9:16",
            ),
            Option(
                default=False,
                value="9:21",
                label="9:21",
            ),
            Option(
                default=False,
                value="21:9",
                label="21:9",
            ),
        ]

        aspect_ratio = Field(
            name="aspect_ratio",
            label="aspect_ratio",
            type="select",
            options=aspect_ratio_options,
        )

        seed = Field(
            name="seed",
            label="seed",
            type="numericfield",
            placeholder="seed",
            defaultValue=0,
            hasHandle=True,
        )

        fields = [prompt, negative_prompt, model, aspect_ratio, seed]

        config = NodeConfig(
            nodeName="Stable Diffusion 3",
            processorType=self.processor_type,
            icon="FaRobot",
            fields=fields,
            outputType="imageUrl",
            section="models",
            helpMessage="stableDiffusionHelp",
            showHandlesNames=True,
        )

        return config

    def process(self):
        prompt = self.get_input_by_name("prompt")
        model = self.get_input_by_name("model")
        seed = self.get_input_by_name("seed")
        aspect_ratio = self.get_input_by_name("aspect_ratio")
        negative_prompt = self.get_input_by_name("negative_prompt")

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("stabilityai_api_key")

        data_to_send = {
            "prompt": prompt,
            "negative_prompt": negative_prompt if model != "sd3-turbo" else None,
            "model": model,
            "seed": seed,
            "aspect_ratio": aspect_ratio,
        }

        response = requests.post(
            f"{self.api_host}/v2beta/stable-image/generate/sd3",
            headers={
                "Accept": "image/*",
                "Authorization": f"Bearer {api_key}",
            },
            files={"none": ""},
            data=data_to_send,
        )

        return self.prepare_and_process_response(response)

    def prepare_and_process_response(self, response):
        if response.status_code != 200:
            raise Exception("Non-200 response: " + str(response.text))

        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{self.name}-{timestamp_str}.png"
        url = storage.save(filename, response.content)

        self.set_output(url)
        return self._output

    def cancel(self):
        pass
