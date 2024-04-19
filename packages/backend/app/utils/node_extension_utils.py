import importlib
import pkgutil
from cachetools import TTLCache, cached

from ..processors.components.extension.extension_base_processor import (
    ExtensionBaseProcessor,
)

very_long_ttl_cache = 120000


def _load_all_schemas():
    schemas = []
    package = importlib.import_module("app.processors.components.extension")
    prefix = package.__name__ + "."

    for importer, module_name, is_pkg in pkgutil.iter_modules(package.__path__, prefix):
        module = importlib.import_module(module_name)

        for attribute_name in dir(module):
            attribute = getattr(module, attribute_name)
            if isinstance(attribute, type) and issubclass(
                attribute, ExtensionBaseProcessor
            ):
                if hasattr(attribute, "get_schema"):
                    schema = attribute.get_schema(attribute)
                    schemas.append(schema)
    return schemas


@cached(TTLCache(maxsize=100, ttl=very_long_ttl_cache))
def get_extensions():
    schemas = _load_all_schemas()
    schemas_dict = []
    for schema in schemas:
        if schema is not None:
            schemas_dict.append(schema.dict())
    return schemas_dict
