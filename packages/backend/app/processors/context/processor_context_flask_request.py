
from .processor_context import ProcessorContext
from flask import g

class ProcessorContextFlaskRequest(ProcessorContext):
    def get_context(self):
        return g
    
    def get_api_key_for_model(self, model_name):
        if model_name == 'gpt-4' or model_name == 'gpt-3.5-turbo':
            return g.get("session_openai_api_key")
        elif model_name == 'claude-2':
            return g.get("session_anthropic_api_key")
        else:
            raise ValueError(f"Unknown model {model_name}")
    
    def get_api_key_for_provider(self, provider):
        if provider == 'openai':
            return g.get("session_openai_api_key")
        elif provider == 'anthropic':
            return g.get("session_anthropic_api_key")
        elif provider == 'stabilityai':
            return g.get("session_stabilityai_api_key")