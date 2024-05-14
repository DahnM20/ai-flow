from app.llms.factory.llm_factory import LLMFactory
from tests.utils.llm_mock import LLMMock
from llama_index.core.base.llms.base import BaseLLM


class LLMMockFactory(LLMFactory):
    def __init__(self, **kwargs):
        super().__init__()
        self.expected_response = kwargs.get("expected_response", None)

    def create_llm(self, model: str, **kwargs) -> BaseLLM:
        return LLMMock(expected_response=self.expected_response)
