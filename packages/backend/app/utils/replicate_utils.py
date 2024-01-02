import os
import requests
from ..env_config import get_replicate_api_key
from cachetools import TTLCache, cached
import logging


short_ttl_cache = 600
long_ttl_cache = 12000
very_long_ttl_cache = 120000

REPLICATE_API_URL = "https://api.replicate.com"
REPLICATE_MODEL_API_URL = f"{REPLICATE_API_URL}/v1/models"
REPLICATE_COLLECTION_API_URL = f"{REPLICATE_API_URL}/v1/collections"


@cached(TTLCache(maxsize=100, ttl=600))
def get_replicate_models(cursor=None):
    api_token = get_replicate_api_key()

    if not api_token:
        raise Exception("Replicate API token not found in environment variables")

    headers = {"Authorization": f"Token {api_token}"}

    url = REPLICATE_MODEL_API_URL

    if cursor:
        url += f"?cursor={cursor}"

    response = requests.get(url=url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch models: {response.status_code}")

    data = response.json()

    for model in data["results"]:
        if "latest_version" in model:
            del model["latest_version"]
        if "default_example" in model:
            del model["default_example"]

    return data


@cached(TTLCache(maxsize=100, ttl=long_ttl_cache))
def get_replicate_collections():
    api_token = get_replicate_api_key()

    if not api_token:
        raise Exception("Replicate API token not found in environment variables")

    headers = {"Authorization": f"Token {api_token}"}

    response = requests.get(REPLICATE_COLLECTION_API_URL, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch collections: {response.status_code}")

    collections = response.json()

    return collections


@cached(TTLCache(maxsize=100, ttl=long_ttl_cache))
def get_replicate_collection_models(collection_slug, cursor=None):
    api_token = get_replicate_api_key()

    if not api_token:
        raise Exception("Replicate API token not found in environment variables")

    headers = {"Authorization": f"Token {api_token}"}

    url = f"{REPLICATE_COLLECTION_API_URL}/{collection_slug}"

    if cursor:
        url += f"?cursor={cursor}"

    response = requests.get(url=url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch collections: {response.status_code}")

    data = response.json()

    for model in data["models"]:
        if "latest_version" in model:
            del model["latest_version"]
        if "default_example" in model:
            del model["default_example"]

    return data


@cached(TTLCache(maxsize=100, ttl=very_long_ttl_cache))
def get_highlighted_models_info():
    models_str = os.getenv("REPLICATE_MODELS_HIGHLIGHTED", None)

    models = []
    if models_str:
        models = models_str.split(",")
        models = [model.strip() for model in models]
    else:
        return None
    models_info = []

    for model in models:
        try:
            info = get_model_info(model)
            models_info.append(info)
        except Exception as e:
            logging.error(f"Failed to fetch model info for {model}: {e}")
            continue

    return models_info


@cached(TTLCache(maxsize=100, ttl=long_ttl_cache))
def get_model_info(model_id):
    api_token = get_replicate_api_key()
    url = f"{REPLICATE_MODEL_API_URL}/{model_id}"

    headers = {"Authorization": f"Token {api_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch model info: {response.status_code}")

    model = response.json()

    if "latest_version" in model:
        del model["latest_version"]
    if "default_example" in model:
        del model["default_example"]

    return model


@cached(TTLCache(maxsize=100, ttl=long_ttl_cache))
def get_model_openapi_schema(model_id):
    api_token = get_replicate_api_key()
    url = f"{REPLICATE_MODEL_API_URL}/{model_id}"

    headers = {"Authorization": f"Token {api_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch model schema: {response.status_code}")

    version = response.json().get("latest_version")
    schema = version.get("openapi_schema", None)

    if not schema:
        raise Exception("OpenAPI schema not found in the response")

    return {
        "schema": schema,
        "modelId": version["id"],
    }


def get_input_schema_from_open_API_schema(openapi_schema):
    input_schema = openapi_schema["components"]["schemas"]["Input"]
    return input_schema


def get_output_schema_from_open_API_schema(openapi_schema):
    output_schema = openapi_schema["components"]["schemas"]["Output"]
    return output_schema
