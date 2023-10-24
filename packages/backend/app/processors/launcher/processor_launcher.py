from abc import ABC, abstractmethod

from ..context.processor_context import ProcessorContext


class ProcessorLauncher(ABC):
    @abstractmethod
    def load_processors(self, config_data):
        pass

    @abstractmethod
    def load_processors_for_node(self, config_data, node_name):
        pass

    @abstractmethod
    def launch_processors(self, processor):
        pass

    @abstractmethod
    def launch_processors_for_node(self, processors, node_name):
        pass
    
    @abstractmethod
    def set_context(self, context: ProcessorContext):
        pass
