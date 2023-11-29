
from app.flask.socketio_init import socketio
import logging
import json

from flask import g, request, session
from flask_socketio import emit
from ..root_injector import root_injector
from .utils.constants import API_KEYS_FIELD_NAME, ENV_API_KEYS, SESSION_USER_ID_KEY

from ..authentication.verify_user import (
    verify_access_token,
    verify_id_token,
)

from ..authentication.cognito_utils import (
    get_cognito_app_client_id,
    get_cognito_keys,
    get_user_details,
    get_user_id_from_cognito_details,
)
from ..processors.launcher.processor_launcher import ProcessorLauncher
from ..processors.context.processor_context_flask_request import ProcessorContextFlaskRequest
import traceback
import os
from .decorators import with_flow_data_validations
from .validators import max_empty_output_data, max_url_input_nodes, max_nodes



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
        if not API_KEYS_FIELD_NAME in data :
            raise Exception(f"No {API_KEYS_FIELD_NAME} provided in data.")
        
        for key, value in data[API_KEYS_FIELD_NAME].items():
            if value:
                setattr(g, f"session_{key}", value)
            else:
                raise Exception(f"No {key} provided in data.")

def log_in_user(user_access_jwt):
    """
    This function is responsible for logging in a user by setting the session context. 
    The session is shared between multiple requests and saved with a client-side (/!\) signed cookie (using the secret_key).
    """
    user_details = get_user_details(user_access_jwt)
    user = get_or_create_user(user_details)
        
    if user is not None :
        session[SESSION_USER_ID_KEY] = get_user_id_from_cognito_details(user_details)
        logging.info("Logged in")

def reset_session_context():
    session[SESSION_USER_ID_KEY] = None


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

    if verify_id_token(user_authentication_jwt, keys, app_client_id) and verify_access_token(user_access_jwt, keys, app_client_id):
        log_in_user(user_access_jwt)
    else:
        reset_session_context()


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
            {"error": str({node_name}) + " - " + str(e), "node_name": node_name},
        )
        traceback.print_exc()
        logging.error(f"An error occurred: {node_name} - {str(e)}")


@socketio.on("disconnect")
def handle_disconnect():
    logging.info("Client disconnected")
    reset_session_context()
