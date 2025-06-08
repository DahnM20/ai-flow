import logging

from app.processors.exceptions import LightException
from ...launcher.event_type import EventType
from ...launcher.processor_event import ProcessorEvent
from ...context.processor_context import ProcessorContext
from ..model import Field, FieldCondition, NodeConfig, Option
from .extension_processor import ContextAwareExtensionProcessor
from openai import OpenAI


class OpenAIReasoningProcessor(ContextAwareExtensionProcessor):
    processor_type = "openai-reasoning-processor"
    streaming = True
    models_with_reasoning_effort = ["o3-mini", "o4-mini", "o3"]

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
                value="o4-mini",
                label="o4-mini",
            ),
            Option(
                default=False,
                value="o3-mini",
                label="o3-mini",
            ),
            Option(
                default=False,
                value="o3",
                label="o3",
            ),
            Option(
                default=False,
                value="o1-pro",
                label="o1-pro",
            ),
            Option(
                default=False,
                value="o1",
                label="o1",
            ),
        ]

        model = Field(
            name="model",
            type="option",
            options=model_options,
            required=True,
        )

        reasoning_effort_options = [
            Option(
                default=False,
                value="low",
                label="low",
            ),
            Option(
                default=True,
                value="medium",
                label="medium",
            ),
            Option(
                default=False,
                value="high",
                label="high",
            ),
        ]

        reasoning_effort = Field(
            name="reasoning_effort",
            label="reasoning_effort",
            type="select",
            options=reasoning_effort_options,
            condition=FieldCondition(
                field="model",
                operator="in",
                value=OpenAIReasoningProcessor.models_with_reasoning_effort,
            ),
        )

        fields = [model, context, text, reasoning_effort]

        config = NodeConfig(
            nodeName="OpenAI o-series",
            processorType=self.processor_type,
            icon="OpenAILogo",
            fields=fields,
            outputType="text",
            section="models",
            helpMessage="openaio1Help",
            showHandlesNames=True,
        )

        return config

    def handle_stream_answer(self, awnser):
        event = ProcessorEvent(self, awnser)
        self.notify(EventType.STREAMING, event)

    def process(self):
        prompt = self.get_input_by_name("prompt")
        context = self.get_input_by_name("context", "")
        model = self.get_input_by_name("model")
        reasoning_effort = self.get_input_by_name("reasoning_effort", "medium")

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("openai_api_key")

        if api_key is None:
            raise Exception("No OpenAI API key found")

        client = OpenAI(api_key=api_key)

        kwargs = {
            "model": model,
            "input": [{"role": "user", "content": f"{context} {prompt}"}],
            "stream": self.streaming,
        }

        if model in OpenAIReasoningProcessor.models_with_reasoning_effort:
            kwargs["reasoning"] = {"effort": reasoning_effort}

        stream = client.responses.create(**kwargs)
        final_response = ""
        for event in stream:
            type = event.type
            if type == "response.output_text.delta":
                final_response += event.delta
                self.handle_stream_answer(final_response)
            if type == "response.completed":
                response_data = event.response
                final_response = response_data.output_text
            if type == "response.failed":
                response_data = event.response
                if not hasattr(response_data, "error"):
                    logging.warning(f"Error from OpenAI with no data: {response_data}")
                    continue

                raise LightException(
                    f"Error from OpenAI : {response_data.error.message}"
                )
            if type == "error":
                raise LightException(f"Error from OpenAI : {event.message}")

        return final_response

    def cancel(self):
        pass
