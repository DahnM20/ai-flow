import importlib
import pkgutil
from ..processors.processor import Processor


class ProcessorFactory:
    def __init__(self):
        self._processors = {}

    def register_processor(self, processor_type, processor_class):
        self._processors[processor_type] = processor_class

    def create_processor(self, config, api_context_data):
        processor_type = config["processorType"]
        processor_class = self._processors.get(processor_type)
        if not processor_class:
            raise ValueError(f"Processor type '{processor_type}' not supported")
        return processor_class(config, api_context_data)

    def load_processors(self):
        package = importlib.import_module("app.processors")
        prefix = package.__name__ + "."
        for importer, module_name, is_pkg in pkgutil.iter_modules(
            package.__path__, prefix
        ):
            module = __import__(module_name, fromlist="dummy")
            for attribute_name in dir(module):
                attribute = getattr(module, attribute_name)
                if isinstance(attribute, type) and issubclass(attribute, Processor):
                    self.register_processor(attribute.processor_type, attribute)
