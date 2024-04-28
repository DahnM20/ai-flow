from app.processors.context.processor_context import ProcessorContext
from typing import List


class ProcessorContextMock(ProcessorContext):
    def __init__(self, api_key, user_id=0, session_id=0) -> None:
        super().__init__()
        self.api_key = api_key
        self.user_id = user_id
        self.session_id = session_id

    def get_context(self):
        return self.api_key

    def get_api_key_for_model(self, model_name):
        return self.api_key

    def get_api_key_for_provider(self, provider):
        return self.api_key

    def get_current_user_id(self):
        return self.user_id

    def get_session_id(self):
        return self.user_id

    def get_parameter_names(self) -> List[str]:
        return super().get_parameter_names()

    def get_value(self, name):
        return super().get_value(name)
