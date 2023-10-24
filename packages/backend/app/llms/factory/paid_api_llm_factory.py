from .llm_factory import LLMFactory
from injector import singleton
from llama_index.llms.base import LLM


@singleton
class PaidAPILLMFactory(LLMFactory):
    def create_llm(self, model: str, **kwargs) -> LLM:
        if model == "gpt-4":
            from llama_index.llms import OpenAI

            return OpenAI(model=model, api_key=kwargs.get("api_key"))
        elif model == "gpt-3.5-turbo":
            from llama_index.llms import OpenAI

            return OpenAI(model=model, api_key=kwargs.get("api_key"))
        elif model == "claude-2":
            from llama_index.llms import Anthropic

            return Anthropic(model=model, api_key=kwargs.get("api_key"))

        else:
            raise ValueError(f"Unknown model {model}")
