from app.env_config import (get_local_storage_folder_path)
from app.flask.app import app
from flask import Blueprint, send_from_directory

image_blueprint = Blueprint('image_blueprint', __name__)

@image_blueprint.route("/image/<path:filename>")
def serve_image(filename):
    """
        Serve image from local storage.
    """
    return send_from_directory(get_local_storage_folder_path(), filename)