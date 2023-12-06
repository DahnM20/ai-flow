from .processor_type_name_utils import INPUT_TEXT
from .processor import SimpleProcessor


class InputProcessor(SimpleProcessor):
    processor_type = INPUT_TEXT

    def __init__(self, config):
        super().__init__(config)
        self.inputText = config["inputText"]

    def updateContext(self, data):
        pass

    def process(self):
        self.set_output(self.inputText)
        return self.inputText
