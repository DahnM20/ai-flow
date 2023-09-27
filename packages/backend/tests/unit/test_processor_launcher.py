import unittest
from unittest.mock import MagicMock, Mock, patch, mock_open

from app.processors_utils.processor_launcher import (
    link_processors,
    load_config_data,
)


class NoInputMock(MagicMock):
    def __getattr__(self, name):
        if name == "input":
            raise AttributeError(
                f"'{type(self).__name__}' object has no attribute 'input'"
            )
        return super().__getattr__(name)


class TestProcessorLauncher(unittest.TestCase):
    def test_load_config_data_valid_file(self):
        m = mock_open(read_data='{"key": "value"}')
        with patch("builtins.open", m):
            data = load_config_data("fake_file_path")
            self.assertEqual(data, {"key": "value"})

    def test_link_processors_valid(self):
        processor1 = Mock()
        processor1.name = "processor1"
        processor1.input = "processor2"

        processor2 = NoInputMock()
        processor2.name = "processor2"

        processors = {
            "processor1": processor1,
            "processor2": processor2,
        }

        link_processors(processors)
        processor1.set_input_processor.assert_called_once_with(processor2)
