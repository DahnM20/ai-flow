import logging
from flask import Blueprint
from ...storage.storage_strategy import StorageStrategy

from ...root_injector import root_injector

upload_blueprint = Blueprint("upload_blueprint", __name__)


@upload_blueprint.route("/upload")
def upload_file():
    """
    Serve image from local storage.
    """

    logging.info("Uploading file")
    storage_strategy = root_injector.get(StorageStrategy)

    data = storage_strategy.get_upload_link()

    json_link = {
        "upload_data": data[0],
        "download_link": data[1],
    }

    return json_link
