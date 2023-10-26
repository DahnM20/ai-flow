from ..factory.llm_factory import LLMFactory
from .prompt_engine import PromptEngine
from ...root_injector import root_injector

class SimplePromptEngine(PromptEngine):
    llm_factory: LLMFactory
    
    
    def __init__(self, model, api_key, custom_llm_factory=None):
        self.model = model
        self.api_key = api_key
        if custom_llm_factory is None:
            custom_llm_factory = self._get_default_llm_factory()

        self.llm_factory = custom_llm_factory

    @staticmethod
    def _get_default_llm_factory():
        return root_injector.get(LLMFactory)

    def prompt(self, messages):
        llm = self.llm_factory.create_llm(self.model, api_key=self.api_key)
        chat_response = llm.chat(messages)
        return chat_response.message.content