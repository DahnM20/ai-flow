import json

from flask import Blueprint, request

from ...utils.node_extension_utils import get_extensions

# from ...utils.openapi_reader import OpenAPIReader
from ...utils.replicate_utils import (
    get_highlighted_models_info,
    get_model_openapi_schema,
    get_replicate_collection_models,
    get_replicate_collections,
    get_replicate_models,
)

node_blueprint = Blueprint("node_blueprint", __name__)


@node_blueprint.route("/node/extensions")
def get_node_extensions():
    extensions = get_extensions()
    return {"extensions": extensions}


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


# @node_blueprint.route("/node/openapi/<path:api_name>/models")
# def get_openapi_models(api_name):
#     api_reader = OpenAPIReader(f"./resources/openapi/{api_name}.json")
#     return api_reader.get_all_paths()


# @node_blueprint.route("/node/openapi/<path:api_name>/config/<path:id>")
# def get_openapi_model_config(api_name, id):
#     api_reader = OpenAPIReader(f"./resources/openapi/{api_name}.json")
#     return api_reader.get_request_schema(id)
