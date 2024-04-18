from ...context.processor_context import ProcessorContext
from ..processor import Processor


class ExtensionBaseProcessor(Processor):
    def __init__(self, config):
        super().__init__(config)

    def get_schema(self):
        pass


class SimpleExtensionProcessor(ExtensionBaseProcessor):
    def __init__(self, config):
        super().__init__(config)

    def cancel(self):
        pass

    def get_api_key(self, key_name):
        pass


class APIContextExtensionProcessor(ExtensionBaseProcessor):
    def __init__(self, config, api_context_data: ProcessorContext = None):
        super().__init__(config)
        self.api_context_data = api_context_data
