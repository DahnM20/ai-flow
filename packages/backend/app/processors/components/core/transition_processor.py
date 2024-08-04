from .processor_type_name_utils import ProcessorType
from ..processor import BasicProcessor


class TransitionProcessor(BasicProcessor):
    processor_type = ProcessorType.TRANSITION

    def __init__(self, config):
        super().__init__(config)

    def process(self):
        input_data = None
        if self.get_input_processor() is None:
            return ""

        input_data = self.get_input_processor().get_output(
            self.get_input_node_output_key()
        )

        return input_data
