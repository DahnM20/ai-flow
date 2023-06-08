import json
import os
from flask import request
from flask_socketio import emit
from .processor_store_singleton import ProcessorStoreSingleton
from .processor_factory import ProcessorFactory

store = ProcessorStoreSingleton().store

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


def load_new_processors_and_stored_ones(config_data, stored_processors, node_name):
    session_id = request.sid
    factory = ProcessorFactory()
    factory.load_processors()

    print("Stored processors: ",stored_processors)
    processors = {}
    for config in config_data:
        processor_key = f"{session_id}_{config['name']}"
        if stored_processors is None or processor_key not in stored_processors or config["name"] == node_name:
            processor = factory.create_processor(config)
            processors[config["name"]] = processor
        else:
            processors[config["name"]] = stored_processors[processor_key]
    return processors


def load_processors_for_node(config_data, stored_processors, node_name):
    factory = ProcessorFactory()
    factory.load_processors()

    processors = load_new_processors_and_stored_ones(config_data, stored_processors, node_name)

    # Établissement des liens entre les processeurs
    link_processors(processors)
    return processors


def launchProcessors(processors, ws=False):
    session_id = request.sid
    for processor in processors.values():
        if ws:
            emit("current_node_running", {"instance_name": processor.name})
        
        output = processor.process()
        print(processor.name, "-", processor.processor_type, ": ", output)
        
        # Store processor for future runs
        processor_key = f"{session_id}_{processor.name}"
        store.set(processor_key, processor)
         
        
        if ws:
            emit("progress", {"instance_name": processor.name, "output": output})


def launch_processors_for_node(processors, node_name=None, ws=False):
    session_id = request.sid
    for processor in processors.values():
        processor_key = f"{session_id}_{processor.name}"
        
        if processor.get_output() is None or processor.name == node_name:
            if ws:
                emit("current_node_running", {"instance_name": processor.name})
                
            output = processor.process()
            print(processor.name, "-", processor.processor_type, ": ", output)
            
            # Store processor for future runs
            processor_key = f"{session_id}_{processor.name}"
            store.set(processor_key, processor)
            
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
