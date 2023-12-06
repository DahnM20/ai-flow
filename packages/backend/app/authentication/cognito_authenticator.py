import os

import requests
import boto3
import logging

from cachetools import cached, TTLCache
from injector import singleton

from .authenticator import Authenticator

from .user_details import UserDetails
from .verify_user import verify_access_token, verify_id_token

@singleton
class CognitoAuthenticator(Authenticator):
    
    CACHE_SIZE = int(os.getenv("CACHE_SIZE", 10))
    CACHE_TTL = int(os.getenv("CACHE_TTL", 3600))
    jwt_keys_cache = TTLCache(maxsize=CACHE_SIZE, ttl=CACHE_TTL)
    
    def __init__(self):
        self.keys = self.get_cognito_keys()
        self.app_client_id = self.get_cognito_app_client_id()

    
    @cached(jwt_keys_cache)
    def get_cognito_keys(self):
        region_name = os.getenv("AWS_REGION_NAME")
        user_pool_id = os.getenv("AWS_COGNITO_USER_POOL_ID")

        keys_url = f"https://cognito-idp.{region_name}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"

        try:
            response = requests.get(keys_url)
            return response.json()["keys"]
        except requests.RequestException as e:
            logging.error(f"Error while retrieving Cognito keys: {e}")
            return []
    
    def get_cognito_app_client_id(self):
        return os.getenv("AWS_COGNITO_APP_CLIENT_ID")


    def authenticate_user(self,user_authentication_jwt, user_access_jwt):
        return verify_id_token(user_authentication_jwt, self.keys, self.app_client_id) and verify_access_token(user_access_jwt, self.keys, self.app_client_id)
    
    def get_user_details(self,access_token):
        client = boto3.client(
            "cognito-idp",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION_NAME"),
        )

        try:
            response = client.get_user(AccessToken=access_token)
            user_id = self.get_user_id_from_user_details(response)
            user_email = self.get_user_email_from_user_details(response)
            user_details = UserDetails(user_id, user_email)
            return user_details
        except Exception as e:
            print(f"Error while retrieving user details: {e}")
            return None

    def get_user_id_from_user_details(self,user_details):
        for attribute in user_details['UserAttributes']:
            if attribute['Name'] == 'sub':
                return attribute['Value']
        return None

    def get_user_email_from_user_details(self,user_details):
        for attribute in user_details['UserAttributes']:
            if attribute['Name'] == 'email':
                return attribute['Value']
        return None