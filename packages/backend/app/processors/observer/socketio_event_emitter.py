from ..launcher.event_type import EventType
from ..launcher.processor_launcher_event import ProcessorLauncherEvent

from .observer import Observer
import logging
from ...flask.socketio_init import socketio


class SocketIOEventEmitter(Observer):
    """
    A SocketIO event emitter that emits events to clients connected via WebSocket.

    This class implements the Observer pattern and is designed to emit events
    to specific client sessions in a Flask-SocketIO application. It can be safely
    executed within greenthreads, making it suitable for use in environments
    where asynchronous operations and real-time communication are required.

    Attributes:
        None

    Methods:
        notify(event, data): Emits the specified event to the client associated
                            with the session ID in `data`. Handles exceptions
                            gracefully and logs emission details.
    """

    def notify(self, event: EventType, data: ProcessorLauncherEvent):
        if event == EventType.STREAMING.value:
            event = EventType.PROGRESS.value

        json_event = {}

        json_event["instanceName"] = data.instance_name

        if data.output is not None:
            json_event["output"] = data.output

        if data.isDone is not None:
            json_event["isDone"] = data.isDone

        if data.error is not None:
            json_event["error"] = str(data.error)

        try:
            socketio.emit(event, json_event, to=data.session_id)
            logging.debug(
                f"Successfully emitted event {event} with data {json_event} to {data.session_id}"
            )
        except Exception as e:
            logging.error(f"Error emitting event {event}: {e}")
