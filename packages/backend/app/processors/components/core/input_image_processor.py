from .processor_type_name_utils import ProcessorType
from ..processor import BasicProcessor


class InputImageProcessor(BasicProcessor):
    processor_type = ProcessorType.INPUT_IMAGE

    def __init__(self, config):
        super().__init__(config)
        self.inputText = config["inputText"]

    def process(self):
        return self.inputText
