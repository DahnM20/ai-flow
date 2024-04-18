from ..core.processor_type_name_utils import ProcessorType
from .extension_base_processor import ExtensionBaseProcessor


class ExampleProcessor(ExtensionBaseProcessor):
    processor_type = ProcessorType.URL_INPUT

    def __init__(self, config):
        super().__init__(config)
        self.url = config["url"]

    def get_schema(self):
        pass

    def process(self):
        urls = [self.url]
        return "Example"
