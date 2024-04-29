from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option
from .extension_processor import ContextAwareExtensionProcessor
from openai import OpenAI
from datetime import datetime


class OpenAITextToSpeechProcessor(ContextAwareExtensionProcessor):
    processor_type = "openai-text-to-speech-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

    def get_schema(self):
        text = Field(
            name="text",
            label="text",
            type="textfield",
            required=True,
            placeholder="InputTextPlaceholder",
            hasHandle=True,
        )

        voices_options = [
            Option(
                default=True,
                value="alloy",
                label="alloy",
            ),
            Option(
                default=False,
                value="echo",
                label="echo",
            ),
            Option(
                default=False,
                value="fable",
                label="fable",
            ),
            Option(
                default=False,
                value="onyx",
                label="onyx",
            ),
            Option(
                default=False,
                value="nova",
                label="nova",
            ),
            Option(
                default=False,
                value="shimmer",
                label="shimmer",
            ),
        ]

        voice = Field(
            name="voice",
            label="voice",
            type="select",
            options=voices_options,
            required=True,
        )

        model_options = [
            Option(
                default=True,
                value="tts-1",
                label="tts-1",
            ),
            Option(
                default=False,
                value="tts-1-hd",
                label="tts-1-hd",
            ),
        ]

        model = Field(
            name="model",
            label="model",
            type="select",
            options=model_options,
            required=True,
        )

        fields = [text, model, voice]

        config = NodeConfig(
            nodeName="TextToSpeech",
            processorType=self.processor_type,
            icon="FaRobot",
            fields=fields,
            outputType="audioUrl",
            section="tools",
            helpMessage="textToSpeechHelp",
            showHandlesNames=True,
        )

        return config

    def process(self):
        text = self.get_input_by_name("text")
        voice = self.get_input_by_name("voice")
        model = self.get_input_by_name("model")

        if text is None:
            return None

        api_key = self._processor_context.get_value("openai_api_key")
        client = OpenAI(api_key=api_key)

        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=text,
        )

        if response is None:
            return None

        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{self.name}-{timestamp_str}.png"

        url = storage.save(filename, response.content)

        return url

    def cancel(self):
        pass
