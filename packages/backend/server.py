import logging
import os
from dotenv import load_dotenv

load_dotenv()

from app.websockets.sockets import app, socketio

if __name__ == '__main__':
    
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))

    logging.basicConfig(level=logging.INFO)
    
    if os.getenv('USE_HTTPS', 'false').lower() == 'true':
        keyfile_path = os.getenv('KEYFILE_PATH', 'default/key/path')
        certfile_path = os.getenv('CERTFILE_PATH', 'default/cert/path')
        socketio.run(app, host=host, port=port, keyfile=keyfile_path, certfile=certfile_path)
    else:
        socketio.run(app, port=port, host=host)