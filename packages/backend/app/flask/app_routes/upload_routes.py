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

    link = storage_strategy.get_upload_link()

    json_link = {
        "upload_link": link[0],
        "download_link": link[1],
    }
    logging.info(f"Link: {json_link}")

    return json_link
