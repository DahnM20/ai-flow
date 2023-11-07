from .llm_factory import LLMFactory
from injector import singleton
from llama_index.llms.base import LLM


@singleton
class PaidAPILLMFactory(LLMFactory):
    API_KEY_FIELD = "api_key"
    
    def create_llm(self, model: str, **kwargs) -> LLM:
        if "gpt" in model:
            from llama_index.llms import OpenAI

            return OpenAI(model=model, api_key=kwargs.get(PaidAPILLMFactory.API_KEY_FIELD))
        elif model == "claude-2":
            from llama_index.llms import Anthropic

            return Anthropic(model=model, api_key=kwargs.get(PaidAPILLMFactory.API_KEY_FIELD))

        else:
            raise ValueError(f"Unknown model {model}")
