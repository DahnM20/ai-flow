from .processor_type_name_utils import ProcessorType
from ..processor import SimpleProcessor


class FileProcessor(SimpleProcessor):
    processor_type = ProcessorType.FILE

    def __init__(self, config):
        super().__init__(config)
        self.url = config["fileUrl"]

    def update_context(self, data):
        pass

    def process(self):
        self.set_output(self.url)
        return self.url
