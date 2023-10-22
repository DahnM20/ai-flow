import unittest
from unittest.mock import ANY, patch

from app.processors.types.ai_data_splitter_processor import AIDataSplitterProcessor
from app.processors.types.input_processor import InputProcessor
from tests.utils.openai_mock_utils import create_mocked_openai_response


class TestAIDataSplitter(unittest.TestCase):
    @staticmethod
    def get_default_valid_config():
        return {
            "input": "45ooyfg7v#input-processor",
            "inputKey": 0,
            "name": "s69w5eiha#ai-data-splitter",
            "processorType": "ai-data-splitter",
            "nbOutput": 0,
        }

    @patch("openai.ChatCompletion.create")
    def test_openai_api_is_called_and_output_splitted(self, mock_openai_create):
        # Arrange
        MODEL = "gpt-4"
        API_KEY = "000000000"
        MOCKED_RESPONSE = "A dog;A dolphin;An elephant"
        EXPECTED_OUTPUT = ["A dog", "A dolphin", "An elephant"]

        mock_openai_create.return_value = create_mocked_openai_response(
            MODEL, API_KEY, MOCKED_RESPONSE
        )

        config = TestAIDataSplitter.get_default_valid_config()

        api_context_data = {"session_openai_api_key": API_KEY}

        input_text = "a dog, a dolphin, an elephant"
        input_processor = InputProcessor(
            {
                "input": "",
                "name": "4f2d3sh03#input-text",
                "processorType": "input-text",
                "inputText": input_text,
            }
        )
        input_processor.set_output(input_text)

        # Act
        processor = AIDataSplitterProcessor(config, api_context_data)
        processor.set_input_processor(input_processor)
        result = processor.process()

        # Assert
        mock_openai_create.assert_called_once_with(
            model=MODEL, messages=ANY, api_key=API_KEY
        )

        self.assertEqual(result, EXPECTED_OUTPUT)

    @patch("openai.ChatCompletion.create")
    def test_process_with_missing_input_return_none_and_does_not_call_openai_api(
        self, mock_openai_create
    ):
        # Arrange
        config = self.get_default_valid_config()

        api_context_data = {"session_openai_api_key": "000000000"}

        processor = AIDataSplitterProcessor(config, api_context_data)

        MODEL = "gpt-4"
        API_KEY = "000000000"
        MOCKED_RESPONSE = "A dog;A dolphin;An elephant"

        mock_openai_create.return_value = create_mocked_openai_response(
            MODEL, API_KEY, MOCKED_RESPONSE
        )

        # Act
        result = processor.process()

        # Assert
        mock_openai_create.assert_not_called()
        self.assertEqual(result, None)
