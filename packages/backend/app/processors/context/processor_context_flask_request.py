
from ...flask.utils.constants import SESSION_USER_ID_KEY
from .processor_context import ProcessorContext
from flask import g, session

class ProcessorContextFlaskRequest(ProcessorContext):
        
    def get_context(self):
        return g
    
    def get_current_user_id(self):
        if session is None :
            return None
        if SESSION_USER_ID_KEY not in session:
            return None
        
        return session[SESSION_USER_ID_KEY]
    
    def get_api_key_for_model(self, model_name):
        if 'gpt-4' in model_name or 'gpt-3.5-turbo' in model_name:
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
        elif provider == 'replicate':
            return g.get("session_replicate_api_key")