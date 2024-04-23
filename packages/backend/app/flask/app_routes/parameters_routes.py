import os
import yaml
from flask import Blueprint

parameters_blueprint = Blueprint("parameters_blueprint", __name__)


def load_config():
    with open("config.yaml", "r") as file:
        return yaml.safe_load(file)


@parameters_blueprint.route("/parameters", methods=["GET"])
def parameters():
    config = load_config()
    return config
