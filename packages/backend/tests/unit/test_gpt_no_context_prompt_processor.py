import unittest
from unittest.mock import ANY, patch

from app.processors.gpt_no_context_prompt_processor import (
    GPTNoContextPromptProcessor,
)
from tests.utils.openai_mock_utils import create_mocked_openai_response


class TestGPTNoContextPromptProcessor(unittest.TestCase):
    @staticmethod
    def get_default_valid_config(model):
        return {
            "input": "",
            "name": "g1ei670qc#gpt-no-context-prompt",
            "processorType": "gpt-no-context-prompt",
            "gptVersion": model,
            "inputText": "Generate a short poem about a bird and a butterfly",
            "x": "-911.2707176494437",
            "y": "-251.00226805963663",
        }

    @patch("openai.ChatCompletion.create")
    def test_openai_api_is_called_with_correct_parameters(self, mock_openai_create):
        # Arrange
        MODEL = "gpt-4"
        API_KEY = "000000000"
        MOCKED_RESPONSE = "Mocked Response"

        mock_openai_create.return_value = create_mocked_openai_response(
            MODEL, API_KEY, MOCKED_RESPONSE
        )

        config = TestGPTNoContextPromptProcessor.get_default_valid_config(MODEL)

        api_context_data = {"session_openai_api_key": API_KEY}

        # Act
        processor = GPTNoContextPromptProcessor(config, api_context_data)
        result = processor.process()

        # Assert
        mock_openai_create.assert_called_once_with(
            model=MODEL, messages=ANY, api_key=API_KEY
        )

        self.assertEqual(result, MOCKED_RESPONSE)

    @patch("openai.ChatCompletion.create")
    def test_when_openai_api_is_called_prompt_is_transmitted(self, mock_openai_create):
        # Arrange
        MODEL = "gpt-4"
        API_KEY = "000000000"
        MOCKED_RESPONSE = "Mocked Response"

        mock_openai_create.return_value = create_mocked_openai_response(
            MODEL, API_KEY, MOCKED_RESPONSE
        )

        config = TestGPTNoContextPromptProcessor.get_default_valid_config(MODEL)

        api_context_data = {"session_openai_api_key": API_KEY}

        # Act
        processor = GPTNoContextPromptProcessor(config, api_context_data)
        processor.process()

        # Assert
        mock_openai_create.assert_called_once_with(
            model=MODEL, messages=ANY, api_key=API_KEY
        )

        called_args = mock_openai_create.call_args[1]

        messages = called_args.get("messages", [])
        input_texts = [msg["content"] for msg in messages if msg["role"] == "user"]

        self.assertEqual(config["inputText"], input_texts[0])

    def test_missing_inputText_raises_exception(self):
        MODEL = "gpt-4"

        # Arrange
        config = self.get_default_valid_config(MODEL)
        del config["inputText"]

        api_context_data = {"session_openai_api_key": "000000000"}

        # Act & Assert
        with self.assertRaises(Exception) as context:
            GPTNoContextPromptProcessor(config, api_context_data)

        self.assertIn("inputText", str(context.exception))
