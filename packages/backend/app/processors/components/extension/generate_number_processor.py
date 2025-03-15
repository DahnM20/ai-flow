import random

from ..node_config_builder import FieldBuilder, NodeConfigBuilder
from ...context.processor_context import ProcessorContext
from .extension_processor import (
    ContextAwareExtensionProcessor,
    DynamicExtensionProcessor,
)


class GenerateNumberProcessor(
    ContextAwareExtensionProcessor, DynamicExtensionProcessor
):
    processor_type = "generate-number-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

    def get_node_config(self):
        min_field = (
            FieldBuilder()
            .set_name("min")
            .set_label("Min")
            .set_type("numericfield")
            .set_description("minimumValueForTheRandomNumber")
            .set_default_value(0)
            .build()
        )
        max_field = (
            FieldBuilder()
            .set_name("max")
            .set_label("Max")
            .set_type("numericfield")
            .set_description("maximumValueForTheRandomNumber")
            .set_default_value(1000)
            .build()
        )
        return (
            NodeConfigBuilder()
            .set_node_name("Generate Number")
            .set_processor_type(self.processor_type)
            .set_section("tools")
            .set_help_message("generateNumberHelp")
            .set_show_handles(True)
            .add_field(min_field)
            .add_field(max_field)
            .set_output_type("text")
            .set_icon("GiPerspectiveDiceSix")
            .build()
        )

    def process(self):
        # Retrieve optional parameters; default values are used if they are not provided.
        min_val = self.get_input_by_name("min")
        max_val = self.get_input_by_name("max")

        try:
            min_val = int(min_val) if min_val is not None else 0
            max_val = int(max_val) if max_val is not None else 500
        except ValueError:
            raise ValueError("Both 'min' and 'max' should be valid numbers")

        if min_val > max_val:
            raise ValueError("'min' should not be greater than 'max'")

        # Generate and return a random number in the inclusive range [min_val, max_val]
        random_number = random.randint(min_val, max_val)
        return [random_number]

    def cancel(self):
        pass
