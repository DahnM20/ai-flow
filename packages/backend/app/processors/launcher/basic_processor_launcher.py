import json
import logging
from typing import List
from injector import inject
from .processor_launcher import ProcessorLauncher
from .event_type import EventType, NodeProcessorEvent

from ..context.processor_context import ProcessorContext

from ..observer.observer import Observer

from ...storage.storage_strategy import StorageStrategy
from ..factory.processor_factory import ProcessorFactory


class BasicProcessorLauncher(ProcessorLauncher):
    """
    Basic Processor Launcher emiting event through flask_socketio websockets

    A class that launches processors based on configuration data.
    """

    
    processor_factory: ProcessorFactory
    storage_strategy: StorageStrategy
    observers: List[Observer]
    context: ProcessorContext

    @inject
    def __init__(
        self,
        processor_factory: ProcessorFactory,
        storage_strategy: StorageStrategy,
        observers: List[Observer] = None,
    ) -> None:
        self.processor_factory = processor_factory
        self.storage_strategy = storage_strategy
        self.processor_factory.load_processors()
        self.observers = observers or []
        self.context = None
        
    
    def set_context(self, context: ProcessorContext):
        self.context = context

    def add_observer(self, observer):
        self.observers.append(observer)

    def _load_config_data(self, fileName):
        with open(fileName, "r") as file:
            config_data = json.load(file)
        return config_data

    def _link_processors(self, processors):
        for processor in processors.values():
            if hasattr(processor, "inputs"):
                for input in processor.inputs:
                    input_processor = processors.get(input.get("inputNode"))
                    if not input_processor:
                        logging.error(
                            f"Link_processors - processor name : '{processor.name}' - input_processor : '{input.get('inputNode')}'"
                        )
                        raise ValueError(
                            f"Input processor '{input.get('inputNode')}' not found"
                        )
                    processor.add_input_processor(input_processor)

    def load_processors(self, config_data):
        processors = {
            config["name"]: self.processor_factory.create_processor(
                config, self.context, self.storage_strategy
            )
            for config in config_data
        }

        self._link_processors(processors)
        return processors
    
    def get_node_by_name(self, config_data, node_name):
        """
        Retrieves a node by its name from the available nodes.

        Parameters:
            config_data (list): A list of dictionaries containing the configuration data for each processor.
            node_name (str): The name of the node to find.

        Returns:
            The node with the given name if found, otherwise None.
        """
        for node in config_data:
            if node.get('name') == node_name:
                return node
        return None

    def load_required_processors(self, config_data, node_name):
        """
        Loads the necessary processors based on the given configuration data and node name.

        Parameters:
            config_data (list): A list of dictionaries containing the configuration data for each processor.
            node_name (str): The name of the node being processed.

        Returns:
            dict: A dictionary mapping processor names to their respective instances.

        The function operates as follows:
            - Iterates over each configuration in config_data.
            - Creates a new processor instance based on the configuration.
            - If outputData is not None and differs from node_name, the processor's output is set accordingly.
            - Stores each processor instance in a dictionary with its name as the key.
        """
        processors = {}
        node = self.get_node_by_name(config_data, node_name)
        if node and not node.get('inputs'):
            processor = self.processor_factory.create_processor(
                node, self.context, self.storage_strategy
            )
            processors[node["name"]] = processor
            logging.debug(f"Created single processor for node - {node_name}")
        else :
            related_config_data = self.get_related_config_data(config_data, node_name, [])
            related_config_data.reverse()
            for config in related_config_data:
                config_output = config.get("outputData", None)
                if config_output is None or config["name"] == node_name:
                    logging.debug(f"Empty or current node - {config['name']}")
                    processor = self.processor_factory.create_processor(
                        config, self.context, self.storage_strategy
                    )
                    processors[config["name"]] = processor
                else:
                    logging.debug(f"Non empty node -  {config['name']}")
                    processor = self.processor_factory.create_processor(
                        config, self.context, self.storage_strategy
                    )
                    processor.set_output(config_output)
                    processors[config["name"]] = processor
        return processors
    
    def get_related_config_data(self, config_data, node_name,  visited):
        if node_name in visited:
            return []
        visited.append(node_name)
        
        current_config = next((config for config in config_data if config["name"] == node_name), None)
        
        if not current_config:
            return []
        
        related_configs = [current_config]
        
        for input in current_config.get("inputs", []):
            related_configs.extend(self.get_related_config_data(config_data, input.get("inputNode"), visited))
        
        return related_configs
    
    def load_processors_for_node(self, config_data, node_name):
        processors = self.load_required_processors(config_data, node_name)

        self._link_processors(processors)
        return processors

    def launch_processors(self, processors):
        for processor in processors.values():
            current_node_running_event_data = NodeProcessorEvent(
                instance_name=processor.name,
                user_id=self.context.get_current_user_id(),
                processor=processor,
            )
            
            self.notify_observers(EventType.CURRENT_NODE_RUNNING.value, current_node_running_event_data)

            try :
                    output = processor.process()
                    progress_event_data = NodeProcessorEvent(
                        instance_name=processor.name,
                        user_id=self.context.get_current_user_id(),
                        output=output,
                        processor_type=processor.processor_type,
                    )
                    self.notify_observers(EventType.PROGRESS.value, progress_event_data)
                    
            except Exception as e:
                error_event_data = NodeProcessorEvent(
                    instance_name=processor.name,
                    user_id=self.context.get_current_user_id(),
                    processor=processor,
                    error=str(e),
                )
                self.notify_observers(
                    EventType.ERROR.value, error_event_data
                )
                raise e

    def launch_processors_for_node(self, processors, node_name=None):
        for processor in processors.values():
            if processor.get_output() is None or processor.name == node_name:
                
                current_node_running_event_data = NodeProcessorEvent(
                    instance_name=processor.name,
                    user_id=self.context.get_current_user_id(),
                    processor=processor,
                )
                
                self.notify_observers(
                    EventType.CURRENT_NODE_RUNNING.value, current_node_running_event_data
                )
                
                try :
                    output = processor.process()
                    
                    progress_event_data = NodeProcessorEvent(
                        instance_name=processor.name,
                        user_id=self.context.get_current_user_id(),
                        output=output,
                        processor_type=processor.processor_type,
                    )
                    self.notify_observers(
                        EventType.PROGRESS.value,
                        progress_event_data
                    )
                    
                except Exception as e:
                    error_event_data = NodeProcessorEvent(
                        instance_name=processor.name,
                        user_id=self.context.get_current_user_id(),
                        processor=processor,
                        error=str(e),
                    )
                    self.notify_observers(
                        EventType.ERROR.value, error_event_data
                    )
                    raise e

            if processor.name == node_name:
                break

    def notify_observers(self, event, data):
        for observer in self.observers:
            observer.notify(event, data)
