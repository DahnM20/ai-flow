from functools import wraps
from flask_socketio import emit
import json


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
