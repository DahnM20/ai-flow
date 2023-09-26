from .processor import Processor

ESCAPE_CHARACTERS = {
    "\\n": "\n",
    "\\t": "\t",
}


class DataSplitterProcessor(Processor):
    processor_type = "data-splitter"

    def __init__(self, config):
        super().__init__(config)
        self.nb_output = 0
        separator_config = config.get("splitChar", ",")
        self.separator = ESCAPE_CHARACTERS.get(separator_config, separator_config)

    def process(self):
        self.data_to_split = self.input_processor.get_output(0)
        self.set_output(self.data_to_split.split(self.separator))
        self.nb_output = len(self._output)
        return self._output

    def updateContext(self, data):
        pass
