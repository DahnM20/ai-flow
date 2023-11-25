from functools import wraps

from flask import jsonify, request, g
from flask_socketio import emit
import json


from ..authentication.cognito_utils import get_cognito_app_client_id, get_cognito_keys, get_user_details, get_user_id_from_cognito_details
from ..authentication.verify_user import verify_access_token, verify_id_token

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
        user_authentication_jwt = request.headers.get('Authorization')
        user_access_jwt = request.headers.get('AccessToken')
        
        keys = get_cognito_keys()
        app_client_id = get_cognito_app_client_id()
        if verify_id_token(user_authentication_jwt, keys, app_client_id) and verify_access_token(user_access_jwt, keys, app_client_id):
            g.user_authentication_jwt = user_authentication_jwt
            g.isAuthenticated = True
            g.user_details = get_user_details(user_access_jwt)
            return func(*args, **kwargs)
        else:
            return jsonify({'error': 'Authentication failed'}), 401
    return decorated_function