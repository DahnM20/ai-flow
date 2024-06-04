from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option
from .extension_processor import ContextAwareExtensionProcessor
import anthropic
from datetime import datetime
from ...launcher.processor_event import ProcessorEvent
from ...launcher.event_type import EventType


class ClaudeAnthropicProcessor(ContextAwareExtensionProcessor):
    processor_type = "claude-anthropic-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

    def get_node_config(self):
        prompt = Field(
            name="prompt",
            label="prompt",
            type="textarea",
            required=True,
            placeholder="InputTextPlaceholder",
            hasHandle=True,
        )

        temperature = Field(
            name="temperature",
            label="temperature",
            type="slider",
            min=0,
            max=1,
            defaultValue=1,
            placeholder="InputTextPlaceholder",
            description="Use temperature closer to 0.0 for analytical / multiple choice, and closer to 1.0 for creative and generative tasks.",
        )

        max_token = Field(
            name="max_tokens",
            label="max_tokens",
            type="numericfield",
            defaultValue=1024,
            max=4000,
            min=1,
            required=True,
            placeholder="InputTextPlaceholder",
            description="The maximum number of tokens to generate before stopping.",
        )

        model_options = [
            Option(
                default=True,
                value="claude-3-opus-20240229",
                label="Claude 3 Opus",
            ),
            Option(
                default=False,
                value="claude-3-sonnet-20240229",
                label="Claude 3 Sonnet",
            ),
            Option(
                default=False,
                value="claude-3-haiku-20240307",
                label="Claude 3 Haiku",
            ),
        ]

        model = Field(
            name="model",
            label="model",
            type="select",
            options=model_options,
            required=True,
        )

        fields = [prompt, model, temperature, max_token]

        config = NodeConfig(
            nodeName="ClaudeAnthropic",
            processorType=self.processor_type,
            icon="FaRobot",
            fields=fields,
            outputType="markdown",
            section="models",
            helpMessage="claudeAnthropichHelp",
            showHandlesNames=True,
        )

        return config

    def process(self):
        prompt = self.get_input_by_name("prompt")
        model = self.get_input_by_name("model", "claude-3-opus-20240229")
        temperature = self.get_input_by_name("temperature", 1)
        max_tokens = self.get_input_by_name("max_tokens", 1024)

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("anthropic_api_key")

        if api_key is None:
            raise Exception("No Anthropic API key found")

        client = anthropic.Anthropic(
            api_key=api_key,
        )

        awnser = ""

        with client.messages.stream(
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            for text in stream.text_stream:
                awnser += text
                event = ProcessorEvent(self, awnser)
                self.notify(EventType.PROGRESS, event)

        return awnser

    def cancel(self):
        pass
