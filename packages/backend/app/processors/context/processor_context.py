from abc import ABC, abstractmethod
from typing import Optional


class ProcessorContext(ABC):
    @abstractmethod
    def get_context(self) -> "ProcessorContext":
        pass

    @abstractmethod
    def get_current_user_id(self) -> Optional[str]:
        pass

    @abstractmethod
    def get_session_id(self) -> Optional[str]:
        pass

    @abstractmethod
    def get_api_key_for_model(self, model_name: str) -> Optional[str]:
        pass

    @abstractmethod
    def get_api_key_for_provider(self, provider: str) -> Optional[str]:
        pass
