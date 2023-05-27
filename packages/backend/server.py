import logging
import os
from dotenv import load_dotenv
from app.websockets.sockets import app, socketio

if __name__ == '__main__':
    load_dotenv()
    
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))

    logging.basicConfig(level=logging.DEBUG)
    socketio.run(app, port=port, host=host, allow_unsafe_werkzeug=True)