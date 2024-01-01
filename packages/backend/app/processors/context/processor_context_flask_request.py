from ...flask.utils.constants import SESSION_USER_ID_KEY
from .processor_context import ProcessorContext

from copy import deepcopy


class ProcessorContextFlaskRequest(ProcessorContext):
    def __init__(self, g_context=None, session_data=None, session_id=None):
        self.g_context = deepcopy(g_context) if g_context is not None else {}
        self.session_data = deepcopy(session_data) if session_data is not None else {}
        self.session_id = deepcopy(session_id) if session_id is not None else None

    def get_context(self) -> "ProcessorContext":
        """Retrieve the stored Flask global context."""
        return self.g_context

    def get_current_user_id(self) -> str:
        """Retrieve the current user ID from the stored session data."""
        return self.session_data.get(SESSION_USER_ID_KEY)

    def get_session_id(self) -> str:
        return self.session_id

    def get_api_key_for_model(self, model_name) -> str:
        if "gpt-4" in model_name or "gpt-3.5-turbo" in model_name:
            return self.g_context.get("session_openai_api_key")
        elif model_name == "claude-2":
            return self.g_context.get("session_anthropic_api_key")
        else:
            raise ValueError(f"Unknown model {model_name}")

    def get_api_key_for_provider(self, provider) -> str:
        """Retrieve the API key for a given provider from the stored context."""
        provider_keys = {
            "openai": "session_openai_api_key",
            "anthropic": "session_anthropic_api_key",
            "stabilityai": "session_stabilityai_api_key",
            "replicate": "session_replicate_api_key",
        }
        key_name = provider_keys.get(provider)
        if key_name:
            return self.g_context.get(key_name)
        else:
            raise ValueError(f"Unknown provider {provider}")
