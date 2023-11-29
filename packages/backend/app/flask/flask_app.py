import logging
from flask import Flask, request, redirect
from flask_cors import CORS
import os

from ..env_config import get_flask_secret_key, get_static_folder

def create_app():
    app = Flask(__name__, static_folder=get_static_folder())

    if get_flask_secret_key() is not None : 
        logging.info("Flask secret key set")
        app.config['SECRET_KEY'] = get_flask_secret_key()
    else :
        logging.warning("Flask secret key not set")
        app.config['SECRET_KEY'] = "default_secret"
        
    CORS(app)


    if os.getenv("USE_HTTPS", "false").lower() == "true":

        @app.before_request
        def before_request():
            if not request.is_secure:
                url = request.url.replace("http://", "https://", 1)
                return redirect(url, code=301)
    
    logging.info("App created")        
    return app
