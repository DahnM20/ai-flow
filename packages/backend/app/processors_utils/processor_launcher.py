import json
import os
import openai
from flask_socketio import emit
from .processor_factory import ProcessorFactory

openai.api_key = os.getenv("OPEN_AI_KEY")


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


def load_new_processors_and_stored_ones(config_data, stored_processors):
    factory = ProcessorFactory()
    factory.load_processors()

    processors = {}
    for config in config_data:
        if stored_processors is None or config["name"] not in stored_processors:
            processor = factory.create_processor(config)
            processors[config["name"]] = processor
        else:
            processors[config["name"]] = stored_processors[config["name"]]
    return processors


def load_processors_for_node(config_data, stored_processors, node_name):
    factory = ProcessorFactory()
    factory.load_processors()

    processors = load_new_processors_and_stored_ones(config_data, stored_processors)

    # Établissement des liens entre les processeurs
    link_processors(processors)
    return processors


def launchProcessors(processors, ws=False):
    for processor in processors.values():
        if ws:
            emit("current_node_running", {"instance_name": processor.name})
        
        output = processor.process()
        print(processor.name, "-", processor.processor_type, ": ", output)
        
        if ws:
            emit("progress", {"instance_name": processor.name, "output": output})


def launch_processors_for_node(processors, node_name=None, ws=False):
    for processor in processors.values():
        if processor.get_output() is None or processor.name == node_name:
            if ws:
                emit("current_node_running", {"instance_name": processor.name})
                
            output = processor.process()
            print(processor.name, "-", processor.processor_type, ": ", output)
            
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
