from functools import wraps
import logging
import json
import sys
import eventlet
from flask import Flask, send_from_directory
from flask import request
from flask import g
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from ..processors_utils.processor_store_singleton import ProcessorStoreSingleton
from ..processors_utils.processor_launcher import (
    load_processors,
    load_processors_for_node,
    launchProcessors,
    launch_processors_for_node,
)
import traceback
import os

if getattr(sys, "frozen", False):
    base_path = sys._MEIPASS
    build_dir = os.path.join(base_path, "build")
else:
    base_path = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(base_path, "..", "..", "..", "ui", "build")

app = Flask(__name__, static_folder=build_dir)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

store = ProcessorStoreSingleton().store

if os.getenv("SERVE_STATIC_FILES") == "true":
    logging.info("Visual interface will be available at http://localhost:5000")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + "/" + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")


def populate_session_global_object(data):
    use_env = os.getenv("USE_ENV_API_KEYS")
    logging.debug("use_env: %s", use_env)
    if use_env == "true":
        g.session_openai_api_key = os.getenv("OPENAI_API_KEY")
        g.session_stabilityai_api_key = os.getenv("STABILITYAI_API_KEY")
    else:
        if "openai_api_key" in data:
            g.session_openai_api_key = data["openai_api_key"]
        else:
            raise Exception("No OpenAI API Key provided.")
        if "stabilityai_api_key" in data:
            g.session_stabilityai_api_key = data["stabilityai_api_key"]


@app.route("/healthcheck", methods=["GET"])
def healthcheck():
    return "ok", 200


@socketio.on("connect")
def handle_connect():
    logging.info("Client connected")


@socketio.on("process_file")
def handle_process_file(data):
    try:
        logging.debug("Received process_config event with data: %s", data)
        populate_session_global_object(data)
        flow_data = json.loads(data.get("json_file"))

        if flow_data:
            processors = load_processors(flow_data)
            output = launchProcessors(processors, ws=True)

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
def handle_process_file(data):
    try:
        logging.debug("Received run_node event with data: %s", data)
        populate_session_global_object(data)
        flow_data = json.loads(data.get("json_file"))
        node_name = data.get("node_name")
        stored_processors_keys = store.keys()
        stored_processors = {}

        if stored_processors_keys:
            for key in stored_processors_keys:
                if key.startswith(request.sid):
                    stored_processors[key] = store.get(key)

        if flow_data and node_name:
            processors = load_processors_for_node(
                flow_data, stored_processors, node_name
            )
            output = launch_processors_for_node(processors, node_name, ws=True)
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
        logging.error(f"An error occurred: {node_name} - {str(e)}")


@socketio.on("disconnect")
def handle_disconnect():
    logging.info("Client disconnected")
