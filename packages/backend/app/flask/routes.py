import logging
from flask import send_from_directory
from app.flask.app import app
import os

if os.getenv("SERVE_STATIC_FILES") == "true":
    logging.info("Visual interface will be available at http://localhost:5000")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + "/" + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.dirname(APP_DIR)
IMAGE_DIRECTORY = os.path.join(BACKEND_DIR, os.getenv("LOCAL_STORAGE_FOLDER_NAME"))


@app.route("/healthcheck", methods=["GET"])
def healthcheck():
    return "ok", 200


@app.route("/image/<path:filename>")
def serve_image(filename):
    return send_from_directory(IMAGE_DIRECTORY, filename)
