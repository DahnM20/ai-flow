from .processor_type_name_utils import ProcessorType
from ..processor import BasicProcessor


class FileProcessor(BasicProcessor):
    processor_type = ProcessorType.FILE

    def __init__(self, config):
        super().__init__(config)
        self.url = config["fileUrl"]

    def process(self):
        return self.url
