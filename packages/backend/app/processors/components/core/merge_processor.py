from ..processor import ContextAwareProcessor
import re
from ....llms.factory.llm_factory import LLMFactory
from ....root_injector import root_injector

from .processor_type_name_utils import ProcessorType, MergeModeEnum

from llama_index.llms.base import ChatMessage


class MergeProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.MERGER_PROMPT
    DEFAULT_MODEL = "gpt-4-1106-preview"

    def __init__(self, config, context, custom_llm_factory=None):
        super().__init__(config, context)

        self.model = config.get("model", MergeProcessor.DEFAULT_MODEL)
        self.prompt = config["prompt"]
        self.merge_mode = MergeModeEnum(int(config["mergeMode"]))
        self.api_key = context.get_api_key_for_model(self.model)
        if custom_llm_factory is None:
            custom_llm_factory = self._get_default_llm_factory()

        self.llm_factory = custom_llm_factory

    @staticmethod
    def _get_default_llm_factory():
        return root_injector.get(LLMFactory)

    def update_prompt(self, inputs):
        for idx, value in enumerate(inputs, start=1):
            placeholder = f"${{input-{idx}}}"
            self.prompt = re.sub(re.escape(placeholder), value, self.prompt)

    def process(self):
        inputs_processor = self.get_input_processors()
        inputs_output_keys = self.get_input_node_output_keys()
        inputs = [
            processor.get_output(output_key)
            for processor, output_key in zip(inputs_processor, inputs_output_keys)
        ]

        self.update_prompt(inputs)

        if self.merge_mode == MergeModeEnum.MERGE:
            self.set_output(self.prompt)
            return self.prompt

        self.init_context()

        llm = self.llm_factory.create_llm(self.model, api_key=self.api_key)
        chat_response = llm.chat(self.messages)
        answer = chat_response.message.content

        self.set_output(answer)
        return answer

    def init_context(self) -> None:
        system_msg = "You are an assistant that provides direct answers to tasks without adding any meta comments or referencing yourself as an AI."
        user_msg_content = self.prompt

        self.messages = [
            ChatMessage(role="system", content=system_msg),
            ChatMessage(role="user", content=user_msg_content),
        ]

    def cancel(self):
        pass
