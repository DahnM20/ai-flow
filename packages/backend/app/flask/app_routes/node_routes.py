from flask import Blueprint
from ...utils.replicate_utils import (
    get_model_openapi_schema,
    get_replicate_models_sdk,
    get_replicate_models,
)


node_blueprint = Blueprint("node_blueprint", __name__)


@node_blueprint.route("/node/models")
def get_models():
    return get_replicate_models()


@node_blueprint.route("/node/replicate/config/<path:model>")
def get_config(model):
    return get_model_openapi_schema(model)
