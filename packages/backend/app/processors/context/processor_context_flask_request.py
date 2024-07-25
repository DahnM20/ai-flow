from typing import List, Optional
from ...flask.utils.constants import PARAMETER_USER_SOURCE, SESSION_USER_ID_KEY
from .processor_context import ProcessorContext

from copy import deepcopy


class ProcessorContextFlaskRequest(ProcessorContext):
    parameter_prefix = "session_"

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

    def get_parameter_names(self) -> List[str]:
        return [
            key.replace(self.parameter_prefix, "")
            for key in dir(self.g_context)
            if not key.startswith("_") and key not in dir(type(self.g_context))
        ]

    def get_value(self, name) -> Optional[str]:
        return self.g_context.get(self.parameter_prefix + name)
