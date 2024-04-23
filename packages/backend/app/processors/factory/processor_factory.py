from abc import ABC, abstractmethod

from ...storage.storage_strategy import StorageStrategy
from ..context.processor_context import ProcessorContext


class ProcessorFactory(ABC):
    @abstractmethod
    def create_processor(
        self,
        config,
        context: ProcessorContext = None,
        storage_strategy: StorageStrategy = None,
    ):
        pass

    @abstractmethod
    def load_processors(self):
        pass
