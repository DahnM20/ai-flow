from .observer import Observer
import logging
from flask_socketio import emit


class EventEmitter(Observer):
    def notify(self, event, data):
        logging.debug(f"Emitting event {event} with data {data}")
        emit(event, data)
