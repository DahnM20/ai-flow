import os
import sys

ENV_LOCAL = "LOCAL"
ENV_CLOUD = "CLOUD"
CURRENT_ENV = os.environ.get("DEPLOYMENT_ENV", ENV_LOCAL)


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
LOCAL_STORAGE_DIR = os.path.join(
    BACKEND_DIR, os.getenv("LOCAL_STORAGE_FOLDER_NAME", "local_storage")
)

def get_static_folder():
    if getattr(sys, "frozen", False):
        base_path = sys._MEIPASS
        build_dir = os.path.join(base_path, "build")
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
        build_dir = os.path.join(base_path, "..", "..", "ui", "build")
    return build_dir

def is_cloud_env():
    return CURRENT_ENV == ENV_CLOUD


def is_local_environment():
    return CURRENT_ENV == ENV_LOCAL


def is_server_static_files_enabled():
    return os.getenv("SERVE_STATIC_FILES") == "true"


def get_local_storage_folder_path():
    return LOCAL_STORAGE_DIR

def get_flask_secret_key():
    return os.getenv("FLASK_SECRET_KEY")
