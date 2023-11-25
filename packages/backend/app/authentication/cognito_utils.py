import os
from cachetools import cached, TTLCache
import requests
import boto3
import logging

CACHE_SIZE = int(os.getenv("CACHE_SIZE", 10))
CACHE_TTL = int(os.getenv("CACHE_TTL", 3600))
jwt_keys_cache = TTLCache(maxsize=CACHE_SIZE, ttl=CACHE_TTL)


@cached(jwt_keys_cache)
def get_cognito_keys():
    region_name = os.getenv("AWS_REGION_NAME")
    user_pool_id = os.getenv("AWS_COGNITO_USER_POOL_ID")

    keys_url = f"https://cognito-idp.{region_name}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"

    try:
        response = requests.get(keys_url)
        return response.json()["keys"]
    except requests.RequestException as e:
        logging.error(f"Error while retrieving Cognito keys: {e}")
        return []


def get_cognito_app_client_id():
    return os.getenv("AWS_COGNITO_APP_CLIENT_ID")


def get_user_details(access_token):
    client = boto3.client(
        "cognito-idp",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION_NAME"),
    )

    try:
        response = client.get_user(AccessToken=access_token)
        return response
    except Exception as e:
        print(f"Error while retrieving user details: {e}")
        return None

def get_user_id_from_cognito_details(user_details):
    for attribute in user_details['UserAttributes']:
        if attribute['Name'] == 'sub':
            return attribute['Value']
    return None

def get_user_email_from_cognito_details(user_details):
    for attribute in user_details['UserAttributes']:
        if attribute['Name'] == 'email':
            return attribute['Value']
    return None