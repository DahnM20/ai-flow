import logging
from datetime import datetime

import anthropic

from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option, Condition, ConditionGroup
from .extension_processor import ContextAwareExtensionProcessor
from ...launcher.processor_event import ProcessorEvent
from ...launcher.event_type import EventType


class ClaudeAnthropicProcessor(ContextAwareExtensionProcessor):
    processor_type = "claude-anthropic-processor"

    model_config_map = {
        "claude-3-7-sonnet-latest": {
            "max_tokens": 8192,
            "max_tokens_thinking": 64000,
        },
        "claude-3-5-haiku-latest": {
            "max_tokens": 8192,
            "max_tokens_thinking": 8192,
        },
        "claude-3-5-sonnet-latest": {
            "max_tokens": 8192,
            "max_tokens_thinking": 8192,
        },
        "claude-3-opus-latest": {
            "max_tokens": 4096,
            "max_tokens_thinking": 4096,
        },
        "claude-3-haiku-20240307": {
            "max_tokens": 4096,
            "max_tokens_thinking": 4096,
        },
        "claude-3-5-sonnet-20240620": {
            "max_tokens": 8192,
            "max_tokens_thinking": 8192,
        },
        "claude-opus-4-0": {
            "max_tokens": 32000,
            "max_tokens_thinking": 32000,
        },
        "claude-sonnet-4-0": {
            "max_tokens": 64000,
            "max_tokens_thinking": 64000,
        },
    }

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.reasoning_content = ""

    def get_node_config(self):

        # Conditions
        claude_thinking_condition = Condition(
            field="model",
            operator="in",
            value=["claude-3-7-sonnet-latest", "claude-opus-4-0", "claude-sonnet-4-0"],
        )

        thinking_enabled_condition = Condition(
            field="thinking", operator="equals", value=True
        )

        budget_token_condition = ConditionGroup(
            conditions=[claude_thinking_condition, thinking_enabled_condition],
            logic="AND",
        )

        # Fields
        prompt = Field(
            name="prompt",
            label="prompt",
            type="textarea",
            required=True,
            placeholder="InputTextPlaceholder",
            hasHandle=True,
        )

        prompt_context = Field(
            name="context",
            label="context",
            type="textfield",
            placeholder="InputTextPlaceholder",
            hasHandle=True,
            description="Additional context that will be used to answer your prompt.",
        )

        temperature = Field(
            name="temperature",
            label="temperature",
            type="slider",
            min=0,
            max=1,
            defaultValue=1,
            placeholder="InputTextPlaceholder",
            description="Use temperature closer to 0.0 for analytical tasks, and closer to 1.0 for creative tasks.",
        )

        budget_token = Field(
            name="budget_tokens",
            label="budget_tokens",
            type="slider",
            defaultValue=1024,
            max=63999,
            min=1024,
            condition=budget_token_condition,
            description=(
                "Determines how many tokens Claude can use for its internal reasoning process. "
                "Larger budgets can enable more thorough analysis for complex problems, improving response quality."
            ),
        )

        model_options = [
            Option(
                default=False,
                value="claude-3-7-sonnet-latest",
                label="Claude 3.7 Sonnet",
            ),
            Option(
                default=False,
                value="claude-3-5-haiku-latest",
                label="Claude 3.5 Haiku",
            ),
            Option(
                default=False,
                value="claude-3-5-sonnet-latest",
                label="Claude 3.5 Sonnet",
            ),
            Option(
                default=False,
                value="claude-3-opus-latest",
                label="Claude 3 Opus",
            ),
            Option(
                default=False,
                value="claude-3-haiku-20240307",
                label="Claude 3 Haiku",
            ),
            Option(
                default=False,
                value="claude-opus-4-0",
                label="Claude 4 Opus",
            ),
            Option(
                default=True,
                value="claude-sonnet-4-0",
                label="Claude 4 Sonnet",
            ),
        ]

        model = Field(
            name="model",
            label="model",
            type="select",
            options=model_options,
            required=True,
        )

        thinking = Field(
            name="thinking",
            label="thinking",
            type="boolean",
            condition=claude_thinking_condition,
        )

        fields = [
            prompt,
            prompt_context,
            model,
            thinking,
            budget_token,
            temperature,
        ]

        config = NodeConfig(
            nodeName="ClaudeAnthropic",
            processorType=self.processor_type,
            icon="AnthropicLogo",
            fields=fields,
            outputType="markdown",
            section="models",
            helpMessage="claudeAnthropichHelp",
            showHandlesNames=True,
        )

        return config

    def handle_stream_awnser(self, awnser):
        event = ProcessorEvent(self, awnser)
        self.notify(EventType.STREAMING, event)

    def process(self):
        """
        Retrieve max_tokens from a map instead of the node config.
        If 'thinking' is enabled and the model supports it, we choose a different max_tokens.
        """

        prompt = self.get_input_by_name("prompt")
        prompt_context = self.get_input_by_name("context", None)
        model = self.get_input_by_name("model", "claude-3-5-sonnet-20240620")
        temperature = self.get_input_by_name("temperature", 1)
        thinking = self.get_input_by_name("thinking", False)

        if "3-7" not in model and "4-0" not in model:
            thinking = False

        budget_tokens = None
        if thinking:
            budget_tokens = self.get_input_by_name("budget_tokens", 1024)

        model_config = ClaudeAnthropicProcessor.model_config_map.get(
            model,
            ClaudeAnthropicProcessor.model_config_map["claude-3-5-sonnet-20240620"],
        )
        if thinking:
            max_tokens = model_config["max_tokens_thinking"]
        else:
            max_tokens = model_config["max_tokens"]

        if prompt is None:
            return None

        api_key = self._processor_context.get_value("anthropic_api_key")
        if api_key is None:
            raise Exception("No Anthropic API key found")

        client = anthropic.Anthropic(api_key=api_key)

        awnser = ""

        if prompt_context is not None:
            messages = [
                {
                    "role": "user",
                    "content": f"Context: {prompt_context} \n Prompt: {prompt}",
                }
            ]
        else:
            messages = [{"role": "user", "content": prompt}]

        stream_kwargs = {
            "model": model,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "messages": messages,
        }

        if thinking:
            stream_kwargs["thinking"] = {
                "budget_tokens": budget_tokens,
                "type": "enabled",
            }

        with client.messages.stream(**stream_kwargs) as stream:
            try:
                current_block_type = None
                for event in stream:
                    if event.type == "content_block_start":
                        current_block_type = event.content_block.type
                    elif event.type == "content_block_delta":
                        if event.delta.type == "thinking_delta":
                            self.reasoning_content += event.delta.thinking
                        elif event.delta.type == "text_delta":
                            awnser += event.delta.text
                            self.handle_stream_awnser(awnser)
                    elif event.type == "message_stop":
                        break
            except Exception as e:
                logging.error(f"An error occurred during streaming : {e}")
                raise Exception("An error occurred during streaming")
            finally:
                stream.close()

        return awnser

    def cancel(self):
        pass
