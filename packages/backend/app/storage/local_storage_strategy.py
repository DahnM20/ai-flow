from ..storage.storage_strategy import StorageStrategy
from werkzeug.utils import secure_filename
import os


class LocalStorageStrategy(StorageStrategy):
    """Local storage strategy. To be used only when you're running the app on your own machine.
    Every generated image is saved in a local directory."""

    LOCAL_DIR = os.getenv("LOCAL_STORAGE_FOLDER_NAME")

    def save(self, filename, data):
        if not os.path.exists(self.LOCAL_DIR):
            os.makedirs(self.LOCAL_DIR)

        secure_name = secure_filename(filename)
        filepath = os.path.join(self.LOCAL_DIR, secure_name)
        with open(filepath, "wb") as f:
            f.write(data)
        return secure_name

    def get_url(self, filename):
        return f"http://127.0.0.1:5000/image/{filename}"
