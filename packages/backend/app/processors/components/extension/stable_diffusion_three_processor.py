import logging
import os
import requests

from ..node_config_builder import FieldBuilder, NodeConfigBuilder
from ...context.processor_context import ProcessorContext
from ..model import Option
from .extension_processor import ContextAwareExtensionProcessor
from datetime import datetime


class StableDiffusionThreeProcessor(ContextAwareExtensionProcessor):
    processor_type = "stabilityai-stable-diffusion-3-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.api_host = os.getenv(
            "STABLE_DIFFUSION_STABILITYAI_API_HOST", "https://api.stability.ai"
        )

    def get_node_config(self):
        prompt = (
            FieldBuilder()
            .set_name("prompt")
            .set_label("Prompt")
            .set_type("textfield")
            .set_required(True)
            .set_placeholder("GenericPromptPlaceholder")
            .set_has_handle(True)
            .build()
        )

        negative_prompt = (
            FieldBuilder()
            .set_name("negative_prompt")
            .set_label("Negative Prompt")
            .set_type("textfield")
            .set_placeholder("GenericNegativePromptPlaceholder")
            .set_has_handle(True)
            .build()
        )

        model_options = [
            Option(default=True, value="sd3-large", label="Stable Diffusion 3 Large"),
            Option(
                default=False, value="sd3-medium", label="Stable Diffusion 3 Medium"
            ),
            Option(
                default=False,
                value="sd3-large-turbo",
                label="Stable Diffusion 3 Large Turbo",
            ),
        ]

        model = (
            FieldBuilder()
            .set_name("model")
            .set_label("Model")
            .set_type("select")
            .set_options(model_options)
            .build()
        )

        aspect_ratio_options = [
            Option(default=True, value="1:1", label="1:1"),
            Option(default=False, value="16:9", label="16:9"),
            Option(default=False, value="3:2", label="3:2"),
            Option(default=False, value="2:3", label="2:3"),
            Option(default=False, value="4:5", label="4:5"),
            Option(default=False, value="5:4", label="5:4"),
            Option(default=False, value="9:16", label="9:16"),
            Option(default=False, value="9:21", label="9:21"),
            Option(default=False, value="21:9", label="21:9"),
        ]

        aspect_ratio = (
            FieldBuilder()
            .set_name("aspect_ratio")
            .set_label("Aspect Ratio")
            .set_type("select")
            .set_options(aspect_ratio_options)
            .build()
        )

        seed = (
            FieldBuilder()
            .set_name("seed")
            .set_label("Seed")
            .set_type("numericfield")
            .set_placeholder("Enter a numeric seed")
            .set_default_value(0)
            .set_has_handle(True)
            .build()
        )

        return (
            NodeConfigBuilder()
            .set_node_name("Stable Diffusion 3")
            .set_processor_type(self.processor_type)
            .set_icon("FaRobot")
            .set_section("models")
            .set_help_message("stableDiffusionPromptHelp")
            .set_output_type("imageUrl")
            .set_show_handles(True)
            .add_field(prompt)
            .add_field(negative_prompt)
            .add_field(model)
            .add_field(aspect_ratio)
            .add_field(seed)
            .build()
        )

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
            logging.error(
                f"API call failed with status {response.status_code}: {response.text}"
            )
            raise Exception(f"API call failed: {response.text}")

        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{self.name}-{timestamp_str}.png"
        url = storage.save(filename, response.content)

        return url

    def cancel(self):
        pass
