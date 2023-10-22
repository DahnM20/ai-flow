import unittest
from unittest.mock import MagicMock, Mock, patch, mock_open

from app.processors.launcher.basic_processor_launcher import BasicProcessorLauncher
from app.processors.factory.processor_factory_iter_modules import (
    ProcessorFactoryIterModules,
)


class NoInputMock(MagicMock):
    def __getattr__(self, name):
        if name == "inputs":
            raise AttributeError(
                f"'{type(self).__name__}' object has no attribute 'inputs'"
            )
        return super().__getattr__(name)


class TestProcessorLauncher(unittest.TestCase):
    def test_load_config_data_valid_file(self):
        factory = ProcessorFactoryIterModules()
        launcher = BasicProcessorLauncher(factory, None)

        m = mock_open(read_data='{"key": "value"}')
        with patch("builtins.open", m):
            data = launcher._load_config_data("fake_file_path")
            self.assertEqual(data, {"key": "value"})

    def test_link_processors_valid(self):
        factory = ProcessorFactoryIterModules()
        launcher = BasicProcessorLauncher(factory, None)

        processor1 = Mock()
        processor1.name = "processor1"
        processor1.inputs = [{"inputNode": "processor2"}]

        processor2 = NoInputMock()
        processor2.name = "processor2"

        processors = {
            "processor1": processor1,
            "processor2": processor2,
        }

        launcher._link_processors(processors)
        processor1.add_input_processor.assert_called_once_with(processor2)
