from ...launcher.event_type import EventType
from ...launcher.processor_event import ProcessorEvent
from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option
from .extension_processor import ContextAwareExtensionProcessor
from openai import OpenAI


class DeepSeekProcessor(ContextAwareExtensionProcessor):
    processor_type = "deepseek-processor"
    streaming = True

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.reasoning_content = ""

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
                default=False,
                value="deepseek-chat",
                label="V3",
            ),
            Option(
                default=True,
                value="deepseek-reasoner",
                label="R1",
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
            nodeName="DeepSeek",
            processorType=self.processor_type,
            icon="DeepSeekLogo",
            fields=fields,
            outputType="text",
            section="models",
            helpMessage="deepSeekHelp",
            showHandlesNames=True,
        )

        return config

    def process(self):
        prompt = self.get_input_by_name("prompt")
        context = self.get_input_by_name("context", "")
        model = self.get_input_by_name("model")

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("deepseek_api_key")

        if api_key is None:
            raise Exception("No DeepSeek API key found")

        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

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
                r_content = getattr(chunk.choices[0].delta, "reasoning_content", None)
                if r_content is not None:
                    self.reasoning_content += r_content

                if not chunk.choices[0].delta.content:
                    continue
                final_response += chunk.choices[0].delta.content
                event = ProcessorEvent(self, final_response)
                self.notify(EventType.STREAMING, event)

            return final_response

        return response.choices[0].message.content

    def cancel(self):
        pass
