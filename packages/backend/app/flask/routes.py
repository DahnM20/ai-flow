import logging
from flask import send_from_directory
from app.flask.app import app
import os
from app.env_config import (
    is_local_environment,
    is_server_static_files_enabled,
    get_local_storage_folder_path,
)


@app.route("/healthcheck", methods=["GET"])
def healthcheck():
    return "OK", 200


if is_local_environment():
    logging.info("Environment set to LOCAL")

    @app.route("/image/<path:filename>")
    def serve_image(filename):
        return send_from_directory(get_local_storage_folder_path(), filename)


if is_server_static_files_enabled():
    logging.info("Visual interface will be available at http://localhost:5000")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + "/" + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")
