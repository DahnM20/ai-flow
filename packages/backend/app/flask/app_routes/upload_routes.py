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
    logging.info(f"Link: {link}")

    return link
