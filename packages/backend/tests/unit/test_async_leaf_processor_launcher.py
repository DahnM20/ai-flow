import unittest
from unittest.mock import MagicMock

from app.processors.launcher.async_leaf_processor_launcher import AsyncLeafProcessorLauncher
from app.processors.factory.processor_factory_iter_modules import (
    ProcessorFactoryIterModules,
)


class MockProcessor:
    def __init__(self, name, input_processors=None):
        self.name = name
        self.input_processors = input_processors or []

    def get_input_processors(self):
        return self.input_processors


class TestAsyncLeafProcessorLauncher(unittest.TestCase):
    def setUp(self):
        factory = ProcessorFactoryIterModules()
        self.launcher = AsyncLeafProcessorLauncher(factory, None)
        self.launcher.set_context(MagicMock())

    def test_independent_processor_no_subsequent_dependencies(self):
        processor1 = MockProcessor("P1")
        processor2 = MockProcessor("P2")
        processors = {"P1": processor1, "P2": processor2}
        self.assertTrue(self.launcher.can_run_independently(processors, processor1))

    def test_processor_with_subsequent_dependencies(self):
        processor1 = MockProcessor("P1")
        processor2 = MockProcessor("P2", [processor1])
        processors = {"P1": processor1, "P2": processor2}
        self.assertFalse(self.launcher.can_run_independently(processors, processor1))

    def test_last_processor_in_list(self):
        processor1 = MockProcessor("P1")
        processors = {"P1": processor1}
        self.assertTrue(self.launcher.can_run_independently(processors, processor1))

    def test_empty_processor_list(self):
        processors = {}
        with self.assertRaises(ValueError):
            self.launcher.can_run_independently(processors, MockProcessor("P1"))

    def test_processor_not_in_list(self):
        processor1 = MockProcessor("P1")
        processors = {"P2": MockProcessor("P2")}
        with self.assertRaises(ValueError):
            self.launcher.can_run_independently(processors, processor1)

    def test_non_sequential_dependencies(self):
        processor1 = MockProcessor("P1")
        processor2 = MockProcessor("P2")
        processor3 = MockProcessor("P3", [processor1])
        processors = {"P1": processor1, "P2": processor2, "P3": processor3}
        self.assertFalse(self.launcher.can_run_independently(processors, processor1))

