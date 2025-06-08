from app.log_config import root_logger
import sys
import os
from dotenv import load_dotenv

load_dotenv()


from app.flask.socketio_init import flask_app, socketio
import app.flask.sockets
import app.flask.routes
import app.tasks.single_thread_tasks.browser.async_browser_task


if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))

    root_logger.info(f"Starting application on {host}:{port}...")
    root_logger.info("You can stop the application by pressing Ctrl+C at any time.")

    # If we're running in a PyInstaller bundle
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        os.environ["PLAYWRIGHT_BROWSERS_PATH"] = os.path.join(
            sys._MEIPASS, "ms-playwright"
        )

    root_logger.warning("Protocol set to HTTP")
    socketio.run(flask_app, port=port, host=host)
