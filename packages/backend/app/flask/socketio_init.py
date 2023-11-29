import eventlet

eventlet.monkey_patch(all=False, socket=True)

from flask_socketio import SocketIO
from .flask_app import create_app

flask_app = create_app()
socketio = SocketIO(flask_app, cors_allowed_origins="*", async_mode="eventlet")