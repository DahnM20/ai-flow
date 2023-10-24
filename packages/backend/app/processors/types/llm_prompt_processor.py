from ..context.processor_context import ProcessorContext
from ...llms.factory.llm_factory import LLMFactory
from .processor import APIContextProcessor
from ...root_injector import root_injector

from llama_index.llms.base import ChatMessage


class LLMPromptProcessor(APIContextProcessor):
    processor_type = "llm-prompt"
    DEFAULT_MODEL = "gpt-4"

    def __init__(
        self, config, api_context_data: ProcessorContext, custom_llm_factory=None
    ):
        super().__init__(config, api_context_data)

        self.model = config.get("model", LLMPromptProcessor.DEFAULT_MODEL)
        self.prompt = config["prompt"]
        self.api_key = api_context_data.get_api_key_for_model(self.model)

        if custom_llm_factory is None:
            custom_llm_factory = self._get_default_llm_factory()

        self.llm_factory = custom_llm_factory

    @staticmethod
    def _get_default_llm_factory():
        return root_injector.get(LLMFactory)

    def process(self):
        input_data = None
        if self.get_input_processor() is not None:
            input_data = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )

        self.init_context(input_data)

        llm = self.llm_factory.create_llm(self.model, api_key=self.api_key)
        chat_response = llm.chat(self.messages)
        answer = chat_response.message.content

        self.set_output(answer)
        return answer

    def init_context(self, input_data: str) -> None:
        """
        Initialise the context for the LLM model with a standard set of messages.
        Additional user input data can be provided, which will be added to the messages.

        :param input_data: additional information to be used by the assistant.
        """
        if input_data is None:
            system_msg = "You are a helpful assistant. "
            user_msg_content = self.prompt
        else:
            system_msg = (
                "You are a helpful assistant. "
                "You will respond to requests indicated by the '#Request' tag, "
                "using the context provided under the '#Context' tag."
            )
            user_msg_content = f"#Context: {input_data} \n\n#Request: {self.prompt}"

        self.messages = [
            ChatMessage(role="system", content=system_msg),
            ChatMessage(role="user", content=user_msg_content),
        ]

    def updateContext(self, data):
        pass
