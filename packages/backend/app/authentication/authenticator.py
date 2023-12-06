from abc import ABC, abstractmethod
from typing import Optional

from .user_details import UserDetails

class Authenticator(ABC):

    @abstractmethod
    def authenticate_user(self, user_authentication_jwt: str, user_access_jwt: str) -> bool:
        """
        Authenticates a user based on JWT tokens.
        
        :param user_authentication_jwt: JWT for user authentication.
        :param user_access_jwt: JWT for user access.
        :return: True if authentication is successful, False otherwise.
        """
        pass

    @abstractmethod
    def get_user_details(self, access_token: str) -> Optional[UserDetails]:
        """
        Retrieves user details based on access token.

        :param access_token: The access token of the user.
        :return: UserDetails object or None in case of failure.
        """
        pass