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


class APIContextExtensionProcessor(ExtensionBaseProcessor):
    def __init__(self, config, context: ProcessorContext = None):
        super().__init__(config)
        self._processor_context = context
