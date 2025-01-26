from ...launcher.event_type import EventType
from ...launcher.processor_event import ProcessorEvent
from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option
from .extension_processor import ContextAwareExtensionProcessor
from openai import OpenAI


class OpenAIReasoningProcessor(ContextAwareExtensionProcessor):
    processor_type = "openai-reasoning-processor"
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

        model_options = [
            Option(
                default=True,
                value="o1-mini",
                label="o1-mini",
            ),
            Option(
                default=False,
                value="o1-preview",
                label="o1-preview",
            ),
        ]

        model = Field(
            name="model",
            type="option",
            options=model_options,
            required=True,
        )

        fields = [model, context, text]

        config = NodeConfig(
            nodeName="OpenAI o1",
            processorType=self.processor_type,
            icon="OpenAILogo",
            fields=fields,
            outputType="text",
            section="models",
            helpMessage="openaio1Help",
            showHandlesNames=True,
        )

        return config

    def process(self):
        prompt = self.get_input_by_name("prompt")
        context = self.get_input_by_name("context", "")
        model = self.get_input_by_name("model")

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("openai_api_key")

        if api_key is None:
            raise Exception("No OpenAI API key found")

        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": f"{context} {prompt}",
                }
            ],
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
