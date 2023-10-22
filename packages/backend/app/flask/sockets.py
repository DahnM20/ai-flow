import eventlet

eventlet.monkey_patch(all=False, socket=True)

from app.flask.app import app
import logging
import json

from flask import g
from flask_socketio import SocketIO, emit
from ..root_injector import root_injector

from ..authentication.verifyUser import (
    verify_access_token,
    verify_id_token,
)

from ..authentication.cognitoUtils import (
    get_cognito_app_client_id,
    get_cognito_keys,
    get_user_details,
)
from ..processors.launcher.processor_launcher import ProcessorLauncher
import traceback
import os
from .decorators import with_flow_data_validations
from .validators import max_empty_output_data, max_url_input_nodes, max_nodes

socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")


def populate_session_global_object(data):
    """
    This function is responsible for initializing global session objects either from the
    environmental variables or from the data passed as arguments, ensuring that the necessary API
    keys are available throughout the session for different processes.

    Parameters:
        data (dict): A dictionary containing potentially necessary keys: "openai_api_key" and "stabilityai_api_key".
    """
    use_env = os.getenv("USE_ENV_API_KEYS")
    logging.debug("use_env: %s", use_env)
    if use_env == "true":
        g.session_openai_api_key = os.getenv("OPENAI_API_KEY")
        g.session_stabilityai_api_key = os.getenv("STABILITYAI_API_KEY")
    else:
        if "openaiApiKey" in data:
            g.session_openai_api_key = data["openaiApiKey"]
        else:
            raise Exception("No OpenAI API Key provided.")
        if "stabilityaiApiKey" in data:
            g.session_stabilityai_api_key = data["stabilityaiApiKey"]


def reset_context():
    g.user_authentication_jwt = None
    g.isAuthenticated = False
    g.user_details = None


@socketio.on("connect")
def handle_connect():
    logging.info("Client connected")


@socketio.on("auth")
def handle_connect(data):
    logging.debug("Auth received")

    user_authentication_jwt = data.get("idToken")
    user_access_jwt = data.get("accessToken")
    keys = get_cognito_keys()
    app_client_id = get_cognito_app_client_id()

    if verify_id_token(
        user_authentication_jwt, keys, app_client_id
    ) and verify_access_token(user_access_jwt, keys, app_client_id):
        g.user_authentication_jwt = user_authentication_jwt
        g.isAuthenticated = True
        g.user_details = get_user_details(user_access_jwt)
        print("Logged in")
    else:
        reset_context()


@socketio.on("process_file")
@with_flow_data_validations(max_nodes, max_url_input_nodes)
def handle_process_file(data):
    """
    This event handler is activated when a "process_file" event is received via Socket.IO. It allows to run every node in
    the file, even if they have been executed before.

    Parameters:
        data (dict): A dictionary encompassing the event's payload, which comprises the JSON configuration file
                    ("jsonFile").

    """
    try:
        populate_session_global_object(data)
        flow_data = json.loads(data.get("jsonFile"))
        launcher = root_injector.get(ProcessorLauncher)

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
        # traceback.print_exc()
        logging.error(f"An error occurred: {str(e)}")


@socketio.on("run_node")
@with_flow_data_validations(max_empty_output_data, max_url_input_nodes)
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
        populate_session_global_object(data)
        flow_data = json.loads(data.get("jsonFile"))
        node_name = data.get("nodeName")

        launcher = root_injector.get(ProcessorLauncher)

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
            {"error": str({node_name}) + " - " + str(e), "node_name": node_name},
        )
        traceback.print_exc()
        logging.error(f"An error occurred: {node_name} - {str(e)}")


@socketio.on("disconnect")
def handle_disconnect():
    logging.info("Client disconnected")
    reset_context()
