from .processor_type_name_utils import ProcessorType
from ..processor import SimpleProcessor


class InputImageProcessor(SimpleProcessor):
    processor_type = ProcessorType.INPUT_IMAGE

    def __init__(self, config):
        super().__init__(config)
        self.inputText = config["inputText"]

    def process(self):
        self.set_output(self.inputText)
        return self.inputText
