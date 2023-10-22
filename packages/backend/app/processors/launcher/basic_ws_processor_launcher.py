import json
import logging
from typing import List
from flask import g
from injector import singleton, inject

from ..observer.observer import Observer

from ...storage.storage_strategy import StorageStrategy
from ..factory.processor_factory import ProcessorFactory


@singleton
class BasicWSProcessorLauncher:
    """
    Basic Processor Launcher emiting event through flask_socketio websockets

    A class that launches processors based on configuration data.
    """

    processor_factory: ProcessorFactory
    storage_strategy: StorageStrategy
    observers: List[Observer]

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

    def add_observer(self, observer):
        self.observers.append(observer)

    def notify_observers(self, event, data):
        for observer in self.observers:
            observer.notify(event, data)

    def _load_config_data(self, fileName):
        with open(fileName, "r") as file:
            config_data = json.load(file)
        return config_data

    def _link_processors(self, processors):
        for processor in processors.values():
            if hasattr(processor, "input"):
                input_name = processor.input
                input_processor = processors.get(input_name)
                if not input_processor:
                    logging.error(
                        f"Link_processors - processor name : '{processor.name}' - input_processor : ''{processor.input}'"
                    )
                    raise ValueError(f"Input processor '{input_name}' not found")
                processor.set_input_processor(input_processor)

    def load_processors(self, config_data):
        processors = {
            config["name"]: self.processor_factory.create_processor(
                config, g, self.storage_strategy
            )
            for config in config_data
        }

        self._link_processors(processors)
        return processors

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
        for config in config_data:
            config_output = config.get("outputData", None)
            if config_output is None or config["name"] == node_name:
                logging.debug(f"Empty or current node - {config['name']}")
                processor = self.processor_factory.create_processor(
                    config, g, self.storage_strategy
                )
                processors[config["name"]] = processor
            else:
                logging.debug(f"Non empty node -  {config['name']}")
                processor = self.processor_factory.create_processor(
                    config, g, self.storage_strategy
                )
                processor.set_output(config_output)
                processors[config["name"]] = processor
        return processors

    def load_processors_for_node(self, config_data, node_name):
        processors = self.load_required_processors(config_data, node_name)

        self._link_processors(processors)
        return processors

    def launch_processors(self, processors):
        for processor in processors.values():
            self.notify_observers(
                "current_node_running", {"instanceName": processor.name}
            )

            output = processor.process()

            self.notify_observers(
                "progress", {"instanceName": processor.name, "output": output}
            )

    def launch_processors_for_node(self, processors, node_name=None):
        for processor in processors.values():
            if processor.get_output() is None or processor.name == node_name:
                self.notify_observers(
                    "current_node_running", {"instanceName": processor.name}
                )
                output = processor.process()
                self.notify_observers(
                    "progress",
                    {"instanceName": processor.name, "output": output},
                )

            if processor.name == node_name:
                break

    def notify_observers(self, event, data):
        for observer in self.observers:
            observer.notify(event, data)
