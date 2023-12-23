import os
import requests
import replicate
from dotenv import load_dotenv

load_dotenv()


def get_replicate_models():
    api_token = os.getenv("REPLICATE_API_KEY")

    if not api_token:
        raise Exception("Replicate API token not found in environment variables")

    url = "https://api.replicate.com/v1/models"

    headers = {"Authorization": f"Token {api_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch models: {response.status_code}")

    models = response.json()

    return models


def get_replicate_models_sdk():
    api_token = os.getenv("REPLICATE_API_KEY")
    api = replicate.Client(api_token=api_token)
    tti = api.collections.get("text-to-image").models

    return tti


def get_model_openapi_schema(model_id):
    api_token = os.getenv("REPLICATE_API_KEY")
    url = f"https://api.replicate.com/v1/models/{model_id}"

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
