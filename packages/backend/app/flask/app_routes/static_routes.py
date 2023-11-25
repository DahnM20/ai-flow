import os
from flask import Blueprint, send_from_directory

from ...env_config import get_static_folder

static_blueprint = Blueprint('static_blueprint', __name__)


@static_blueprint.route("/", defaults={"path": ""})
@static_blueprint.route("/<path:path>")
def serve(path):
    """
        Serve UI static files from the static folder. 
    """
    static_folder = get_static_folder()
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, "index.html")