from .processor_type_name_utils import ProcessorType
from ..processor import SimpleProcessor


class TransitionProcessor(SimpleProcessor):
    processor_type = ProcessorType.TRANSITION

    def __init__(self, config):
        super().__init__(config)

    def update_context(self, data):
        pass

    def process(self):
        input_data = None
        if self.get_input_processor() is not None:
            input_data = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )
            self.set_output(input_data)

        return input_data
