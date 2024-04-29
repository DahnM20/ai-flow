from .processor_type_name_utils import ProcessorType
from ..processor import BasicProcessor


class InputProcessor(BasicProcessor):
    processor_type = ProcessorType.INPUT_TEXT

    def __init__(self, config):
        super().__init__(config)
        self.inputText = config["inputText"]

    def process(self):
        self.set_output(self.inputText)
        return self.inputText
