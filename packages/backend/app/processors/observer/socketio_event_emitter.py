from .observer import Observer
import logging
from flask_socketio import emit


class SocketIOEventEmitter(Observer):
    def notify(self, event, data):
        logging.debug(f"Emitting event {event} with data {data}")
        
        json_event = {}
        
        json_event["instanceName"] = data.instance_name
        
        if data.output is not None:
            json_event["output"] = data.output
            
        if data.error is not None:
            json_event["error"] = data.error
        
        emit(event, json_event)
