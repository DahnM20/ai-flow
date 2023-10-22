import logging
from jose import jwk, jwt
from jose.utils import base64url_decode
import time


def verify_token_signature(token, keys):
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header["kid"]

    matching_key = None
    for key in keys:
        if key["kid"] == kid:
            matching_key = key
            break

    if matching_key is None:
        return False

    public_key = jwk.construct(matching_key)
    message, encoded_signature = str(token).rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    if not public_key.verify(message.encode("utf8"), decoded_signature):
        logging.error("Signature verification failed")
        return False

    logging.debug("Signature successfully verified")
    return True


def verify_exp(claims):
    if time.time() > claims["exp"]:
        print("Token is expired")
        return False
    return True


def verify_access_token(token, keys, app_client_id):
    if not verify_token_signature(token, keys):
        return False

    claims = jwt.get_unverified_claims(token)
    if not verify_exp(claims):
        return False

    if claims["client_id"] != app_client_id:
        print("Token was not issued for this audience")
        return False

    return claims


def verify_id_token(token, keys, app_client_id):
    if not verify_token_signature(token, keys):
        return False

    claims = jwt.get_unverified_claims(token)
    if not verify_exp(claims):
        return False

    if claims["aud"] != app_client_id:
        print("Token was not issued for this audience")
        return False

    return claims
