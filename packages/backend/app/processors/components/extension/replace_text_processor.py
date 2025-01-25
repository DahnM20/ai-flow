import logging
import re

from ..node_config_builder import FieldBuilder, NodeConfigBuilder
from .extension_processor import BasicExtensionProcessor
from ..core.processor_type_name_utils import ProcessorType


class ReplaceTextProcessor(BasicExtensionProcessor):
    processor_type = ProcessorType.REPLACE_TEXT

    def __init__(self, config):
        super().__init__(config)

    def get_node_config(self):
        input_text_field = (
            FieldBuilder()
            .set_name("input_text")
            .set_label("Input Text")
            .set_type("textarea")
            .set_required(True)
            .set_placeholder("ReplaceTextInputPlaceholder")
            .set_has_handle(True)
            .build()
        )

        search_text_field = (
            FieldBuilder()
            .set_name("search_text")
            .set_label("Search Text")
            .set_type("textfield")
            .set_required(True)
            .set_placeholder("ReplaceTextSearchPlaceholder")
            .set_has_handle(True)
            .build()
        )

        replacement_text_field = (
            FieldBuilder()
            .set_name("replacement_text")
            .set_label("Replacement Text")
            .set_type("textfield")
            .set_required(True)
            .set_placeholder("ReplaceTextReplacePlaceholder")
            .set_has_handle(True)
            .build()
        )

        replace_all_field = (
            FieldBuilder()
            .set_name("replace_all")
            .set_label("Replace All Occurrences")
            .set_type("boolean")
            .set_default_value(True)
            .build()
        )

        use_regex_field = (
            FieldBuilder()
            .set_name("use_regex")
            .set_label("Use Regular Expression")
            .set_type("boolean")
            .set_default_value(False)
            .build()
        )

        case_sensitivity_field = (
            FieldBuilder()
            .set_name("case_sensitivity")
            .set_label("Case Sensitive")
            .set_type("boolean")
            .set_default_value(True)
            .build()
        )

        return (
            NodeConfigBuilder()
            .set_node_name("ReplaceText")
            .set_processor_type(self.processor_type.value)
            .set_section("tools")
            .set_help_message("replaceTextNodeHelp")
            .set_show_handles(True)
            .set_output_type("text")
            .set_default_hide_output(False)
            .add_field(input_text_field)
            .add_field(search_text_field)
            .add_field(replacement_text_field)
            .add_field(replace_all_field)
            .add_field(case_sensitivity_field)
            .add_field(use_regex_field)
            .set_icon("MdSwapHoriz")
            .build()
        )

    def process(self):
        input_text = self.get_input_by_name("input_text")
        search_text = self.get_input_by_name("search_text")
        replacement_text = self.get_input_by_name("replacement_text")
        replace_all = self.get_input_by_name("replace_all")
        use_regex = self.get_input_by_name("use_regex")
        case_sensitivity = self.get_input_by_name("case_sensitivity")

        flags = 0
        if not case_sensitivity:
            flags |= re.IGNORECASE

        if use_regex:
            try:
                pattern = re.compile(search_text, flags)
                count = 0 if replace_all else 1
                result_text = pattern.sub(replacement_text, input_text, count=count)
            except re.error as e:
                logging.warning(f"Invalid regular expression: {e}")
                result_text = input_text
        else:
            if not case_sensitivity:
                escaped_search_text = re.escape(search_text)
                pattern = re.compile(escaped_search_text, flags)
                count = 0 if replace_all else 1
                result_text = pattern.sub(replacement_text, input_text, count=count)
            else:
                if replace_all:
                    result_text = input_text.replace(search_text, replacement_text)
                else:
                    result_text = input_text.replace(search_text, replacement_text, 1)

        return [result_text]
