from .processor_type_name_utils import ProcessorType
from ..processor import BasicProcessor


class DisplayProcessor(BasicProcessor):
    processor_type = ProcessorType.DISPLAY

    def __init__(self, config):
        super().__init__(config)

    def process(self):
        input_data = None
        if self.get_input_processor() is not None:
            input_data = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )
            self.set_output(input_data)

        return input_data
