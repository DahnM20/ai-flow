from ...llms.utils.max_token_for_model import max_token_for_model, nb_token_for_input
from ...llms.prompt_engine.simple_prompt_engine import SimplePromptEngine
from ...llms.prompt_engine.vector_index_prompt_engine import VectorIndexPromptEngine
from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor

from llama_index.llms.base import ChatMessage


class LLMPromptProcessor(APIContextProcessor):
    processor_type = "llm-prompt"
    DEFAULT_MODEL = "gpt-4"

    def __init__(self, config, api_context_data: ProcessorContext):
        super().__init__(config, api_context_data)

        self.model = config.get("model", LLMPromptProcessor.DEFAULT_MODEL)
        self.prompt = config.get("prompt", "")
        self.api_key = api_context_data.get_api_key_for_model(self.model)

    def process(self):
        input_data = None
        if self.get_input_processor() is not None:
            input_data = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )

        if input_data is not None and nb_token_for_input(
            input_data, self.model
        ) > max_token_for_model(self.model):
            prompt_engine = VectorIndexPromptEngine(
                model=self.model, api_key=self.api_key, init_data=input_data
            )
            answer = prompt_engine.prompt(self.prompt)
        else:
            self.init_context(input_data)
            prompt_engine = SimplePromptEngine(model=self.model, api_key=self.api_key)
            answer = prompt_engine.prompt(self.messages)

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
