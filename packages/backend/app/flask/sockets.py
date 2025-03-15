import eventlet
from ..env_config import is_set_app_config_on_ui_enabled

eventlet.monkey_patch(all=False, socket=True)

from app.flask.socketio_init import flask_app
from app.flask.socketio_init import socketio
import logging
import json

from flask import g, request, session
from flask_socketio import emit
from ..root_injector import root_injector
from .utils.constants import PARAMETERS_FIELD_NAME, ENV_API_KEYS

from ..processors.launcher.processor_launcher import ProcessorLauncher
from ..processors.context.processor_context_flask_request import (
    ProcessorContextFlaskRequest,
)
import traceback
import os


def populate_request_global_object(data):
    """
    This function is responsible for initializing individual request objects either from the
    environmental variables or from the data passed as arguments, ensuring that the necessary API
    keys are available throughout the request for different processes.

    Parameters:
        data (dict): A dictionary containing potentially necessary keys: "openai_api_key" and "stabilityai_api_key".
    """
    use_env = os.getenv("USE_ENV_API_KEYS", "false").lower()
    logging.debug("use_env: %s", use_env)

    if use_env == "true":
        for key in ENV_API_KEYS:
            env_key = key.upper()
            value = os.getenv(env_key)
            if not value:
                raise Exception(f"Required {env_key} not provided in environment.")
            setattr(g, f"session_{key}", value)
    else:
        if not PARAMETERS_FIELD_NAME in data:
            raise Exception(f"No {PARAMETERS_FIELD_NAME} provided in data.")

        for key, value in data[PARAMETERS_FIELD_NAME].items():
            if value:
                setattr(g, f"session_{key}", value)
            else:
                raise Exception(f"No {key} provided in data.")


@socketio.on("connect")
def handle_connect():
    logging.info("Client connected")


@socketio.on("process_file")
def handle_process_file(data):
    """
    This event handler is activated when a "process_file" event is received via Socket.IO. It allows to run every node in
    the file, even if they have been executed before.

    Parameters:
        data (dict): A dictionary encompassing the event's payload, which comprises the JSON configuration file
                    ("jsonFile").

    """
    try:
        populate_request_global_object(data)
        flow_data = json.loads(data.get("jsonFile"))
        launcher = root_injector.get(ProcessorLauncher)
        launcher.set_context(ProcessorContextFlaskRequest(g, session, request.sid))

        if flow_data:
            processors = launcher.load_processors(flow_data)
            output = launcher.launch_processors(processors)

            logging.debug("Emitting processing_result event with output: %s", output)
            emit("run_end", {"output": output})
        else:
            logging.warning("Invalid input or missing configuration file")
            emit("error", {"error": "Invalid input or missing configuration file"})
    except Exception as e:
        emit("error", {"error": str(e)})
        traceback.print_exc()
        logging.error(f"An error occurred: {str(e)}")


@socketio.on("run_node")
def handle_run_node(data):
    """
    This event handler is activated when a "run_node" event is received via Socket.IO. It facilitates the processing
    of the specified node in the data payload, launching only the designated node and preceding nodes if they
    haven't been executed earlier.

    Parameters:
        data (dict): A dictionary encompassing the event's payload, which comprises the JSON configuration file
                    ("jsonFile") and the name of the node to run ("nodeName").

    """
    try:
        populate_request_global_object(data)
        flow_data = json.loads(data.get("jsonFile"))
        node_name = data.get("nodeName")

        launcher = root_injector.get(ProcessorLauncher)
        launcher.set_context(ProcessorContextFlaskRequest(g, session, request.sid))

        if flow_data and node_name:
            processors = launcher.load_processors_for_node(flow_data, node_name)
            output = launcher.launch_processors_for_node(processors, node_name)
            logging.debug("Emitting processing_result event with output: %s", output)
            emit("run_end", {"output": output})
        else:
            logging.warning("Invalid input or missing parameters")
            emit("error", {"error": "Invalid input or missing parameters"})
    except Exception as e:
        emit(
            "error",
            {"error": str(e), "nodeName": node_name},
        )
        traceback.print_exc()
        logging.error(f"An error occurred: {node_name} - {str(e)}")


@socketio.on("disconnect")
def handle_disconnect():
    logging.info("Client disconnected")


@socketio.on("update_app_config")
def handle_update_app_config(data):
    if not is_set_app_config_on_ui_enabled():
        return

    logging.info("Updating app config")
    config_keys = [
        "S3_BUCKET_NAME",
        "S3_AWS_ACCESS_KEY_ID",
        "S3_AWS_SECRET_ACCESS_KEY",
        "S3_AWS_REGION_NAME",
        "S3_ENDPOINT_URL",
        "REPLICATE_API_KEY",
    ]
    for key in config_keys:
        value = data.get(key)

        if value is not None and str(value).strip():
            logging.info(f"Setting {key}")
            os.environ[key] = value
