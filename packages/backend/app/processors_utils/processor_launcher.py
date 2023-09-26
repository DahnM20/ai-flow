import json
import logging
from flask import g
from flask_socketio import emit
from .processor_factory import ProcessorFactory

from ..env_config import is_cloud_env
from ..storage.s3_storage_strategy import S3StorageStrategy
from ..storage.local_storage_strategy import LocalStorageStrategy


def load_config_data(fileName):
    with open(fileName, "r") as file:
        config_data = json.load(file)
    return config_data


def link_processors(processors):
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


def load_processors(config_data):
    factory = ProcessorFactory()
    factory.load_processors()
    storage_strategy = get_storage_strategy()

    processors = {
        config["name"]: factory.create_processor(config, g, storage_strategy)
        for config in config_data
    }

    link_processors(processors)
    print("list :", processors)
    return processors


def load_required_processors(config_data, node_name):
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
    factory = ProcessorFactory()
    factory.load_processors()
    storage_strategy = get_storage_strategy()
    processors = {}
    for config in config_data:
        config_output = config.get("outputData", None)
        if config_output is None or config["name"] == node_name:
            logging.debug(f"Empty or current node - {config['name']}")
            processor = factory.create_processor(config, g, storage_strategy)
            processors[config["name"]] = processor
        else:
            logging.debug(f"Non empty node -  {config['name']}")
            processor = factory.create_processor(config, g, storage_strategy)
            processor.set_output(config_output)
            processors[config["name"]] = processor
    return processors


def load_processors_for_node(config_data, node_name):
    factory = ProcessorFactory()
    factory.load_processors()

    processors = load_required_processors(config_data, node_name)

    link_processors(processors)
    return processors


def launchProcessors(processors, ws=False):
    for processor in processors.values():
        if ws:
            emit("current_node_running", {"instanceName": processor.name})

        output = processor.process()
        logging.debug(processor.name, "-", processor.processor_type, ": ", output)

        if ws:
            emit("progress", {"instanceName": processor.name, "output": output})


def launch_processors_for_node(processors, node_name=None, ws=False):
    for processor in processors.values():
        if processor.get_output() is None or processor.name == node_name:
            if ws:
                emit("current_node_running", {"instanceName": processor.name})

            output = processor.process()
            logging.debug(processor.name, "-", processor.processor_type, ": ", output)

            if ws:
                emit("progress", {"instanceName": processor.name, "output": output})
        if processor.name == node_name:
            break


def get_storage_strategy():
    if is_cloud_env():
        return S3StorageStrategy()
    else:
        return LocalStorageStrategy()


if __name__ == "__main__":
    config_data = load_config_data("./examples/test.json")
    print(config_data)
    processors = load_processors(config_data)
    print(processors)
    launchProcessors(processors)
