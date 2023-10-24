from abc import ABC, abstractmethod


class ProcessorContext(ABC):
    @abstractmethod
    def get_context(self):
        pass
    
    @abstractmethod
    def get_api_key_for_model(self, model_name):
        pass
    
    @abstractmethod
    def get_api_key_for_provider(self, provider):
        pass