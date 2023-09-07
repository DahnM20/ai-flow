import json
import logging
import pprint
from flask_socketio import emit
from .processor_factory import ProcessorFactory


def load_config_data(fileName):
    # Lecture du fichier de configuration
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
    # Enregistrement des processeurs dans la factory
    factory = ProcessorFactory()
    factory.load_processors()

    # Instanciation des processeurs
    processors = {
        config["name"]: factory.create_processor(config) for config in config_data
    }

    # Établissement des liens entre les processeurs
    link_processors(processors)
    return processors


def load_required_processors(config_data, node_name):
    factory = ProcessorFactory()
    factory.load_processors()
    processors = {}
    for config in config_data:
        config_output = config.get("output_data", None)
        if config_output is None or config["name"] == node_name:
            print("Empty or current node ", config["name"])
            processor = factory.create_processor(config)
            processors[config["name"]] = processor
        else:
            print("non empty ", config["name"])
            processor = factory.create_processor(config)
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
            emit("current_node_running", {"instance_name": processor.name})

        output = processor.process()
        logging.debug(processor.name, "-", processor.processor_type, ": ", output)

        if ws:
            emit("progress", {"instance_name": processor.name, "output": output})


def launch_processors_for_node(processors, node_name=None, ws=False):
    for processor in processors.values():
        if processor.get_output() is None or processor.name == node_name:
            if ws:
                emit("current_node_running", {"instance_name": processor.name})

            output = processor.process()
            logging.debug(processor.name, "-", processor.processor_type, ": ", output)

            if ws:
                emit("progress", {"instance_name": processor.name, "output": output})
        if processor.name == node_name:
            break


if __name__ == "__main__":
    config_data = load_config_data("./examples/test.json")
    print(config_data)
    processors = load_processors(config_data)
    print(processors)
    launchProcessors(processors)
