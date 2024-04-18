import importlib
import logging
import pkgutil
import inspect
from ..components.processor import Processor
from .processor_factory import ProcessorFactory
from injector import singleton


@singleton
class ProcessorFactoryIterModules(ProcessorFactory):
    def __init__(self):
        self._processors = {}

    def register_processor(self, processor_type, processor_class):
        self._processors[processor_type] = processor_class

    def create_processor(self, config, api_context_data=None, storage_strategy=None):
        processor_type = config["processorType"]
        processor_class = self._processors.get(processor_type)
        if not processor_class:
            raise ValueError(f"Processor type '{processor_type}' not supported")

        params = inspect.signature(processor_class.__init__).parameters
        api_context_param = params.get("api_context_data")

        processor = None
        if api_context_param is not None:
            processor = processor_class(
                config=config, api_context_data=api_context_data
            )
        else:
            processor = processor_class(config=config)
        processor.set_storage_strategy(storage_strategy)

        return processor

    def load_processors(self):
        self._load_recursive("app.processors.components")

    def _load_recursive(self, package_name):
        package = importlib.import_module(package_name)
        prefix = package.__name__ + "."
        for importer, module_name, is_pkg in pkgutil.iter_modules(
            package.__path__, prefix
        ):
            if is_pkg:
                self._load_recursive(module_name)
            else:
                module = __import__(module_name, fromlist="dummy")
                for attribute_name in dir(module):
                    attribute = getattr(module, attribute_name)
                    if isinstance(attribute, type) and issubclass(attribute, Processor):
                        if attribute.processor_type is not None:
                            self.register_processor(
                                attribute.processor_type.value, attribute
                            )
