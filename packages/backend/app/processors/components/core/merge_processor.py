from ..processor import ContextAwareProcessor
from .processor_type_name_utils import ProcessorType, MergeModeEnum

class MergeProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.MERGER_PROMPT

    def __init__(self, config, context):
        super().__init__(config, context)

        self.merge_mode = MergeModeEnum(int(config["mergeMode"]))

    def update_prompt(self, inputs):
        for idx, value in enumerate(inputs, start=1):
            placeholder = f"${{input-{idx}}}"
            self.prompt = self.prompt.replace(placeholder, str(value))

    def process(self):
        self.prompt = self.get_input_by_name("prompt", "")
        input_names = self.get_input_names_from_config()
        inputs = [self.get_input_by_name(name, "") for name in input_names]

        self.update_prompt(inputs)

        return self.prompt

    def cancel(self):
        pass
