from flask import Blueprint, request
from ...utils.replicate_utils import (
    get_model_openapi_schema,
    get_replicate_models,
    get_replicate_collections,
    get_replicate_collection_models,
    get_highlighted_models_info,
)


node_blueprint = Blueprint("node_blueprint", __name__)


@node_blueprint.route("/node/models")
def get_public_models():
    cursor = request.args.get("cursor", None)

    public = get_replicate_models(cursor=cursor)
    highlighted = get_highlighted_models_info()

    return {"public": public, "highlighted": highlighted}


@node_blueprint.route("/node/collections")
def get_collections():
    return get_replicate_collections()


@node_blueprint.route("/node/collections/<path:collection>")
def get_collection_models(collection):
    cursor = request.args.get("cursor", None)
    return get_replicate_collection_models(collection, cursor=cursor)


@node_blueprint.route("/node/replicate/config/<path:model>")
def get_config(model):
    return get_model_openapi_schema(model)
