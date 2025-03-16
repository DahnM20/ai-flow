import os
import sys
from typing import List, Optional

ENV_LOCAL = "LOCAL"
ENV_CLOUD = "CLOUD"
CURRENT_ENV = os.environ.get("DEPLOYMENT_ENV", ENV_LOCAL)


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
LOCAL_STORAGE_DIR = os.path.join(
    BACKEND_DIR, os.getenv("LOCAL_STORAGE_FOLDER_NAME", "local_storage")
)


def get_static_folder() -> str:
    if getattr(sys, "frozen", False):
        base_path = sys._MEIPASS
        build_dir = os.path.join(base_path, "build")
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
        build_dir = os.path.join(base_path, "..", "..", "ui", "build")
    return build_dir


def is_cloud_env() -> bool:
    return CURRENT_ENV == ENV_CLOUD


def is_local_environment() -> bool:
    return CURRENT_ENV == ENV_LOCAL


def is_mock_env() -> bool:
    return os.getenv("USE_MOCK") == "true"


def is_server_static_files_enabled() -> bool:
    return os.getenv("SERVE_STATIC_FILES") == "true"


def get_local_storage_folder_path() -> str:
    return LOCAL_STORAGE_DIR


def get_flask_secret_key() -> Optional[str]:
    return os.getenv("FLASK_SECRET_KEY")


def get_replicate_api_key() -> Optional[str]:
    return os.getenv("REPLICATE_API_KEY")


def get_background_task_max_workers() -> int:
    return int(os.getenv("BACKGROUND_TASK_MAX_WORKERS", "2"))


def use_async_browser() -> bool:
    return os.getenv("USE_ASYNC_BROWSER") == "true"


def get_browser_tab_max_usage() -> int:
    return int(os.getenv("BROWSER_TAB_MAX_USAGE", "100"))


def get_browser_tab_pool_size() -> int:
    return int(os.getenv("BROWSER_TAB_POOL_SIZE", "3"))


def is_set_app_config_on_ui_enabled() -> bool:
    return os.getenv("ENABLE_SET_APP_CONFIG_ON_UI", "true") == "true"


def is_s3_enabled() -> bool:
    return os.getenv("S3_AWS_ACCESS_KEY_ID") is not None
