import unittest
from unittest.mock import ANY, patch

from dotenv import load_dotenv

load_dotenv()

from app.flask.socketio_init import flask_app, socketio

from app.processors.components.core.ai_data_splitter_processor import (
    AIDataSplitterProcessor,
)
from app.processors.components.core.input_processor import InputProcessor
from tests.utils.llm_factory_mock import LLMMockFactory
from tests.utils.processor_context_mock import ProcessorContextMock


class TestAIDataSplitter(unittest.TestCase):
    @staticmethod
    def get_default_valid_config():
        return {
            "inputs": [{"inputNode": "4f2d3sh03#input-processor"}],
            "name": "s69w5eiha#ai-data-splitter",
            "processorType": "ai-data-splitter",
            "nbOutput": 0,
        }

    def test_process_with_missing_input_return_none_and_does_not_call_openai_api(self):
        # Arrange
        MODEL = "gpt-4"
        API_KEY = "000000000"
        MOCKED_RESPONSE = "A dog;A dolphin;An elephant"

        config = self.get_default_valid_config()

        context = ProcessorContextMock(API_KEY)

        mock_factory = LLMMockFactory(expected_response=MOCKED_RESPONSE)
        processor = AIDataSplitterProcessor(config, context, mock_factory)

        # Act
        result = processor.process()

        # Assert
        self.assertEqual(result, "")
