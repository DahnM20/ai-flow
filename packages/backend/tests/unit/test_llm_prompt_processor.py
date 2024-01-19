import unittest
from unittest.mock import ANY, patch

from app.processors.types.llm_prompt_processor import (
    LLMPromptProcessor,
)
from tests.utils.llm_factory_mock import LLMMockFactory
from tests.utils.processor_context_mock import ProcessorContextMock


class TestLLMPromptProcessor(unittest.TestCase):
    @staticmethod
    def get_default_valid_config(model):
        return {
            "input": [],
            "name": "g1ei670qc#llm-prompt",
            "processorType": "llm-prompt",
            "model": model,
            "prompt": "Generate a short poem about a bird and a butterfly",
            "x": "-911.2707176494437",
            "y": "-251.00226805963663",
        }

    def test_openai_api_is_called_with_correct_parameters(self):
        # Arrange
        MODEL = "gpt-4"
        API_KEY = "000000000"
        RESPONSE_EXPECTED = "Mocked Response"
        MOCKED_RESPONSE = ["Mocked ", "Response"]

        config = TestLLMPromptProcessor.get_default_valid_config(MODEL)

        api_context_data = ProcessorContextMock(API_KEY)
        mock_factory = LLMMockFactory(expected_response=MOCKED_RESPONSE)

        with patch(
            "app.llms.prompt_engine.simple_prompt_engine.SimplePromptEngine._get_default_llm_factory",
            return_value=mock_factory,
        ):
            # Act
            processor = LLMPromptProcessor(config, api_context_data)
            result = processor.process()

            # Assert
            self.assertEqual(result, RESPONSE_EXPECTED)

    def test_missing_inputText_raises_exception(self):
        MODEL = "gpt-4"
        API_KEY = "000000000"

        # Arrange
        config = self.get_default_valid_config(MODEL)
        del config["prompt"]

        api_context_data = ProcessorContextMock(API_KEY)

        # Act & Assert
        with self.assertRaises(Exception) as context:
            LLMPromptProcessor(config, api_context_data)

        self.assertIn("prompt", str(context.exception))
