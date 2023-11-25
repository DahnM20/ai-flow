import logging
from app.env_config import (is_server_static_files_enabled, is_local_environment)
from app.flask.app import app
from .utils.constants import HTTP_OK



@app.route("/healthcheck", methods=["GET"])
def healthcheck():
    return "OK", HTTP_OK


if is_server_static_files_enabled():
    from .app_routes.static_routes import static_blueprint
    logging.info("Visual interface will be available at http://localhost:5000")
    app.register_blueprint(static_blueprint)
    
if is_local_environment():
    from .app_routes.image_routes import image_blueprint
    logging.info("Environment set to LOCAL")
    app.register_blueprint(image_blueprint)
