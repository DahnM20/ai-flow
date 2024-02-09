import logging
from app.env_config import is_server_static_files_enabled, is_local_environment
from app.flask.socketio_init import flask_app
from .utils.constants import HTTP_OK


@flask_app.route("/healthcheck", methods=["GET"])
def healthcheck():
    return "OK", HTTP_OK


from .app_routes.node_routes import node_blueprint

flask_app.register_blueprint(node_blueprint)

from .app_routes.upload_routes import upload_blueprint

flask_app.register_blueprint(upload_blueprint)

if is_server_static_files_enabled():
    from .app_routes.static_routes import static_blueprint

    logging.info("Visual interface will be available at http://localhost:5000")
    flask_app.register_blueprint(static_blueprint)

if is_local_environment():
    from .app_routes.image_routes import image_blueprint

    logging.info("Environment set to LOCAL")
    flask_app.register_blueprint(image_blueprint)
