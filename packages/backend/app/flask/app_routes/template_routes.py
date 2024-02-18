import logging
from flask import Blueprint, request
from ...providers.template.template_provider import TemplateProvider
from ...root_injector import root_injector

template_blueprint = Blueprint("template_blueprint", __name__)


@template_blueprint.route("/template")
def get_default_templates():
    cursor = request.args.get("cursor", None)

    template_provider = root_injector.get(TemplateProvider)

    templates = template_provider.get_templates(cursor=cursor)

    return templates


@template_blueprint.route("/template/<int:template_id>")
def get_template_by_id(template_id):
    template_provider = root_injector.get(TemplateProvider)

    template = template_provider.get_template_by_id(template_id)

    return template
