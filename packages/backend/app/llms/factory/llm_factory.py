from abc import ABC, abstractmethod
from llama_index.llms.base import LLM

class LLMFactory(ABC):
    
    @abstractmethod
    def create_llm(self, model: str, **kwargs) -> LLM:
        pass