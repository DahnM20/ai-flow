from ...launcher.processor_event import ProcessorEvent
from ...launcher.event_type import EventType
from ....llms.utils.max_token_for_model import max_token_for_model, nb_token_for_input
from ....llms.prompt_engine.simple_prompt_engine import SimplePromptEngine
from ....llms.prompt_engine.vector_index_prompt_engine import VectorIndexPromptEngine
from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor

from .processor_type_name_utils import ProcessorType
from llama_index.llms.base import ChatMessage


class LLMPromptProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.LLM_PROMPT
    DEFAULT_MODEL = "gpt-4"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

        self.model = config.get("model", LLMPromptProcessor.DEFAULT_MODEL)
        self.prompt = config["prompt"]
        self.api_key = context.get_api_key_for_model(self.model)

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
            awnser = prompt_engine.prompt(self.prompt)
        else:
            self.init_context(input_data)
            prompt_engine = SimplePromptEngine(model=self.model, api_key=self.api_key)
            stream_chat_response = prompt_engine.prompt_stream(self.messages)
            awnser = ""
            for r in stream_chat_response:
                awnser += r.delta
                event = ProcessorEvent(self, awnser)
                self.notify(EventType.PROGRESS, event)
        self.set_output(awnser)
        return awnser

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
                "Your response should feel natural and seamless, as if you've internalized the context "
                "and are answering the request without needing to directly point back to the information provided"
            )
            user_msg_content = f"#Context: {input_data} \n\n#Request: {self.prompt}"

        self.messages = [
            ChatMessage(role="system", content=system_msg),
            ChatMessage(role="user", content=user_msg_content),
        ]

    def cancel(self):
        pass
