import os
import requests
from ..env_config import get_replicate_api_key
import replicate
from cachetools import TTLCache, cached


lru_short_ttl_cache = TTLCache(maxsize=100, ttl=600)
lru_long_ttl_cache = TTLCache(maxsize=100, ttl=12000)

REPLICATE_API_URL = "https://api.replicate.com"
REPLICATE_MODEL_API_URL = f"{REPLICATE_API_URL}/v1/models"


@cached(lru_short_ttl_cache)
def get_replicate_models():
    api_token = get_replicate_api_key()

    if not api_token:
        raise Exception("Replicate API token not found in environment variables")

    headers = {"Authorization": f"Token {api_token}"}

    response = requests.get(REPLICATE_MODEL_API_URL, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch models: {response.status_code}")

    models = response.json()

    return models


@cached(lru_short_ttl_cache)
def get_replicate_models_sdk():
    api_token = get_replicate_api_key()
    api = replicate.Client(api_token=api_token)
    tti = api.collections.get("text-to-image").models

    return tti


@cached(lru_long_ttl_cache)
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

    input_schema = schema["components"]["schemas"]["Input"]
    output_schema = schema["components"]["schemas"]["Output"]

    return {
        "inputSchema": input_schema,
        "outputSchema": output_schema,
        "modelId": version["id"],
    }
