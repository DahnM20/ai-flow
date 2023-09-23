from ..storage.storage_strategy import StorageStrategy
from werkzeug.utils import secure_filename
import os
from app.env_config import (
    get_local_storage_folder_path,
)


class LocalStorageStrategy(StorageStrategy):
    """Local storage strategy. To be used only when you're running the app on your own machine.
    Every generated image is saved in a local directory."""

    LOCAL_DIR = get_local_storage_folder_path()

    def save(self, filename, data):
        if not os.path.exists(self.LOCAL_DIR):
            os.makedirs(self.LOCAL_DIR)

        secure_name = secure_filename(filename)
        filepath = os.path.join(self.LOCAL_DIR, secure_name)
        with open(filepath, "wb") as f:
            f.write(data)

        return self.get_url(secure_name)

    def get_url(self, filename):
        port = os.getenv("PORT")
        return f"http://localhost:{port}/image/{filename}"
