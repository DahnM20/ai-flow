import logging

from ....env_config import is_local_environment

from ...launcher.event_type import EventType
from ...launcher.processor_event import ProcessorEvent
from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option, Condition
from .extension_processor import ContextAwareExtensionProcessor
from openai import OpenAI
import requests
from cachetools import TTLCache, cached


def load_models_from_file():
    import json
    import os

    current_dir = os.path.dirname(os.path.abspath(__file__))
    models_file_path = os.path.join(
        current_dir,
        "..",
        "..",
        "..",
        "..",
        "resources",
        "data",
        "openrouter_models.json",
    )
    with open(models_file_path, "r") as file:
        models = json.load(file)

    return models.get("data", [])


@cached(TTLCache(maxsize=1, ttl=120000))
def get_models():
    """
    Fetches the list of available models from OpenRouter API.
    Caches the result to avoid redundant API calls.
    """
    url = "https://openrouter.ai/api/v1/models"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        models = response.json()
        return models.get("data", [])
    except Exception as e:
        logging.warning(
            f"Failed to fetch OpenRouter models - Loading from file instead: {e}"
        )
        return load_models_from_file()


@cached(TTLCache(maxsize=1, ttl=120000))
def get_text_to_image_model_ids():
    """
    Returns a list of model IDs that support text to image generation.
    """
    available_models = get_models()
    text_image_model_ids = [
        model["id"]
        for model in available_models
        if model.get("architecture").get("modality") == "text+image->text"
    ]
    return text_image_model_ids


class OpenRouterProcessor(ContextAwareExtensionProcessor):
    processor_type = "openrouter-processor"
    streaming = True

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

    def get_node_config(self):
        context = Field(
            name="context",
            label="context",
            type="textfield",
            required=False,
            placeholder="ContextPlaceholder",
            hasHandle=True,
        )

        text = Field(
            name="prompt",
            label="prompt",
            type="textarea",
            required=True,
            placeholder="PromptPlaceholder",
            hasHandle=True,
        )

        available_models = get_models()

        target_default_model_id = "google/gemma-2-9b-it:free"

        model_options = [
            Option(
                default=(model["id"] == target_default_model_id),
                value=model["id"],
                label=model.get("name", model["id"]),
            )
            for model in available_models
        ]

        model_field = Field(
            name="model",
            label="model",
            type="select",
            options=model_options,
            required=True,
        )

        text_image_model_ids = get_text_to_image_model_ids()

        image_url_condition = Condition(
            field="model", operator="in", value=text_image_model_ids
        )

        image_url = Field(
            name="image_url",
            label="Image URL",
            type="textfield",
            placeholder="InputImagePlaceholder",
            hasHandle=True,
            condition=image_url_condition,
        )

        fields = [model_field, image_url, context, text]

        config = NodeConfig(
            nodeName="OpenRouter",
            processorType=self.processor_type,
            icon="OpenRouterLogo",
            fields=fields,
            outputType="text",
            section="models",
            helpMessage="openRouterHelp",
            showHandlesNames=True,
        )

        return config

    def process(self):
        prompt = self.get_input_by_name("prompt")
        context = self.get_input_by_name("context", "")
        model = self.get_input_by_name("model")
        image_url = self.get_input_by_name("image_url", None)

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("openrouter_api_key")

        if api_key is None:
            raise Exception("No OpenRouter API key found")

        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

        text_image_model_ids = get_text_to_image_model_ids()

        if image_url is not None and model in text_image_model_ids:
            content = [
                {
                    "type": "image_url",
                    "image_url": {"url": image_url},
                },
                {"type": "text", "text": prompt},
            ]
        else:
            content = f"{context} {prompt}"

        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": content}],
            stream=self.streaming,
        )

        if self.streaming:
            final_response = ""
            for chunk in response:
                if not chunk.choices[0].delta.content:
                    continue
                final_response += chunk.choices[0].delta.content
                event = ProcessorEvent(self, final_response)
                self.notify(EventType.STREAMING, event)

            return final_response

        return response.choices[0].message.content

    def cancel(self):
        pass
