from abc import ABC, abstractmethod


class ProcessorFactory(ABC):
    @abstractmethod
    def create_processor(self, config, api_context_data=None, storage_strategy=None):
        pass

    @abstractmethod
    def load_processors(self):
        pass
