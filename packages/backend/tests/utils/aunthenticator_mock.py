from typing import Optional
from app.authentication.user_details import UserDetails
from app.authentication.authenticator import Authenticator

class AuthenticatorMock(Authenticator):

    def authenticate_user(self, user_authentication_jwt: str, user_access_jwt: str) -> bool:
        return True

    def get_user_details(self, access_token: str) -> Optional[UserDetails]:
        return UserDetails("1", "test@email.com")