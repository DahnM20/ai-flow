from abc import ABC, abstractmethod


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
    def launchProcessorsForNode(self, processors, node_name):
        pass
