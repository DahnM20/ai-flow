from abc import ABC, abstractmethod
from typing import Optional
from typing import List


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
    def get_parameter_names(self) -> List[str]:
        """
        List all the parameter names currently stored in the context.
        Returns:
            A list of parameter names.
        """
        pass

    @abstractmethod
    def get_value(self, name) -> Optional[str]:
        """
        Retrieve the value associated with the specified parameter name.
        Returns:
            The value of the parameter if found, otherwise None.
        """
        pass
