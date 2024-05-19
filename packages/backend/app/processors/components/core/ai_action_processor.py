from .llm_prompt_processor import LLMPromptProcessor

from llama_index.core.base.llms.base import ChatMessage


from .processor_type_name_utils import ProcessorType


class AIActionProcessor(LLMPromptProcessor):
    processor_type = ProcessorType.AI_ACTION

    def __init__(self, config, context) -> None:
        super().__init__(config, context)

    def init_context(self, input_data: str) -> None:
        """
        Initialise the context for the OpenAI Chat model with a standard set of messages.
        Additional user input data can be provided, which will be added to the messages.

        :param input_data: Additional information to be used by the assistant.
        """
        system_msg = (
            "You are an assistant that provides direct answers to tasks indicated by the #Task tag, using the data provided by the #Data tag."
            "without adding any meta comments or referencing yourself as an AI."
        )

        if input_data:
            user_msg_content = f"#Data {input_data} \n\n #Task {self.prompt}"
        else:
            user_msg_content = f"#Task {self.prompt}"

        self.messages = [
            ChatMessage(role="system", content=system_msg),
            ChatMessage(role="user", content=user_msg_content),
        ]
