from functools import wraps

from flask import jsonify, request, g
from flask_socketio import emit
import json

from ..root_injector import root_injector

from ..authentication.authenticator import Authenticator

def with_flow_data_validations(*validation_funcs):
    def decorator(func):
        @wraps(func)
        def wrapper(data, *args, **kwargs):
            try:
                flow_data = json.loads(data.get("jsonFile", "{}"))

                for validation_func in validation_funcs:
                    validation_func(flow_data)

                return func(data, *args, **kwargs)
            except Exception as e:
                emit("error", {"error": str(e)})

        return wrapper

    return decorator


def authenticate_user(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        authenticator = root_injector.get(Authenticator)

        user_authentication_jwt = request.headers.get('Authorization')
        user_access_jwt = request.headers.get('AccessToken')
        
        if authenticator.authenticate_user(user_authentication_jwt,user_access_jwt):
            g.user_authentication_jwt = user_authentication_jwt
            g.isAuthenticated = True
            g.user_details = authenticator.get_user_details(user_access_jwt)
            return func(*args, **kwargs)
        else:
            return jsonify({'error': 'Authentication failed'}), 401
    return decorated_function