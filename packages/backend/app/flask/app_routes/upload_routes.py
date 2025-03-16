import logging
from flask import Blueprint
from ...storage.storage_strategy import StorageStrategy

from ...root_injector import get_root_injector
from flask import request

upload_blueprint = Blueprint("upload_blueprint", __name__)


@upload_blueprint.route("/upload")
def upload_file():
    """
    Serve image from local storage.
    """

    logging.info("Uploading file")
    storage_strategy = get_root_injector().get(StorageStrategy)

    filename = request.args.get("filename")
    try:
        data = storage_strategy.get_upload_link(filename)
    except Exception as e:
        logging.error(e)
        raise Exception(
            "Error uploading file. "
            "Please check your S3 configuration. "
            "If you've not configured S3 please refer to docs.ai-flow.net/docs/file-upload"
        )

    json_link = {
        "upload_data": data[0],
        "download_link": data[1],
    }

    return json_link
