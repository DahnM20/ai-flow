import unittest
from app.processors.factory.processor_factory_iter_modules import (
    ProcessorFactoryIterModules,
)
from app.processors.types.processor import SimpleProcessor, APIContextProcessor


class DummyProcessor(SimpleProcessor):
    processor_type = "dummy_processor"

    def process(self):
        pass

    def updateContext(self, data):
        pass


class APIDummyProcessor(APIContextProcessor):
    processor_type = "api_dummy_processor"

    def __init__(self, config, api_context_data=None):
        super().__init__(config)
        self.api_context_data = api_context_data

    def process(self):
        pass

    def updateContext(self, data):
        pass


class TestProcessorFactory(unittest.TestCase):
    def setUp(self):
        self.factory = ProcessorFactoryIterModules()

    def test_register_and_create_simple_processor(self):
        self.factory.register_processor(DummyProcessor.processor_type, DummyProcessor)
        processor = self.factory.create_processor(
            {"processorType": "dummy_processor", "name": "dummy_processor"}
        )
        self.assertIsInstance(processor, DummyProcessor)
        self.assertIsInstance(processor, SimpleProcessor)

    def test_create_unknown_processor_raises_exception(self):
        with self.assertRaises(ValueError):
            self.factory.create_processor(
                {"processorType": "unknown_processor", "name": "unknown_processor"}
            )

    def test_create_processor_with_api_context_data(self):
        self.factory.register_processor(
            APIDummyProcessor.processor_type, APIDummyProcessor
        )
        processor = self.factory.create_processor(
            {"processorType": "api_dummy_processor", "name": "api_dummy_processor"},
            api_context_data="api_data",
        )
        self.assertIsInstance(processor, APIDummyProcessor)
        self.assertIsInstance(processor, APIContextProcessor)
        self.assertEqual(processor.api_context_data, "api_data")
