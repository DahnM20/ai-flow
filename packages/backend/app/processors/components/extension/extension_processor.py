from ...context.processor_context import ProcessorContext
from ..processor import BasicProcessor, ContextAwareProcessor


class ExtensionProcessor:
    """Base interface for extension processors"""

    def get_schema(self):
        pass


class BasicExtensionProcessor(ExtensionProcessor, BasicProcessor):
    """A basic extension processor that does not depend on user-specific parameters.

    Inherits basic processing capabilities from BasicProcessor and schema handling from ExtensionProcessor.

    Args:
        config (dict): Configuration dictionary for processor setup.
    """

    def __init__(self, config):
        super().__init__(config)


class ContextAwareExtensionProcessor(ExtensionProcessor, ContextAwareProcessor):
    """An extension processor that requires context about the user, such as user-specific settings or keys.

    This class supports context-aware processing by incorporating user context into the processing flow.

    Args:
        config (dict): Configuration dictionary for processor setup.
        context (ProcessorContext, optional): Context object containing user-specific parameters. Defaults to None.
    """

    def __init__(self, config, context: ProcessorContext = None):
        super().__init__(config)
        self._processor_context = context
