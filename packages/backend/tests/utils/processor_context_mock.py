from app.processors.context.processor_context import ProcessorContext


class ProcessorContextMock(ProcessorContext):
    def __init__(self, api_key) -> None:
        super().__init__()
        self.api_key = api_key

    def get_context(self):
        return self.api_key

    def get_api_key_for_model(self, model_name):
        return self.api_key

    def get_api_key_for_provider(self, provider):
        return self.api_key
