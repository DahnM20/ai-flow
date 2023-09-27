import unittest
from unittest.mock import ANY, patch, Mock
import re
from app.processors.stable_diffusion_stabilityai_prompt_processor import (
    StableDiffusionStabilityAIPromptProcessor,
)
from app.storage.local_storage_strategy import LocalStorageStrategy
from app.processors.input_processor import InputProcessor


class TestStableDiffusionStabilityAIPromptProcessor(unittest.TestCase):
    @staticmethod
    def get_default_valid_config():
        return {
            "input": "0rhbnaol3#gpt-no-context-prompt",
            "inputKey": 0,
            "name": "vd6up8r0m#stable-diffusion-stabilityai-prompt",
            "processorType": "stable-diffusion-stabilityai-prompt",
            "size": "1024x1024",
            "x": -1961.3132869508825,
            "y": -73.26855714327525,
        }

    @patch("requests.post")
    def test_process_returns_valid_image_url_on_successful_api_response(
        self, mock_post
    ):
        # Arrange
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "artifacts": [{"base64": "R0lGODlhAQABAAAAACw="}]
        }
        mock_post.return_value = mock_response

        url_pattern = re.compile(r"http?://[^\s]+")

        config = self.get_default_valid_config()
        clean_name = config["name"].replace("#", "")
        api_context_data = {"session_stabilityai_api_key": "fake_api_key"}

        processor = StableDiffusionStabilityAIPromptProcessor(config, api_context_data)
        processor.set_storage_strategy(LocalStorageStrategy())

        # Act
        result = processor.process()
        url = result[0]

        # Assert
        self.assertTrue(url_pattern.match(url))
        self.assertIn(clean_name, url)
        self.assertTrue(url.endswith(".png"))

        mock_post.assert_called_once_with(
            ANY,
            headers=ANY,
            json=ANY,
        )

    @patch("requests.post")
    def test_process_transmit_prompt_to_api(self, mock_post):
        # Arrange
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "artifacts": [{"base64": "R0lGODlhAQABAAAAACw="}]
        }
        mock_post.return_value = mock_response

        config = self.get_default_valid_config()
        expected_prompt = "Expected prompt"
        config["prompt"] = expected_prompt

        api_context_data = {"session_stabilityai_api_key": "fake_api_key"}
        processor = StableDiffusionStabilityAIPromptProcessor(config, api_context_data)
        processor.set_storage_strategy(LocalStorageStrategy())

        # Act
        processor.process()

        # Assert
        called_args = mock_post.call_args[1]
        sent_json = called_args.get("json")
        transmitted_prompts = sent_json["text_prompts"]
        self.assertTrue(
            any(prompt["text"] == expected_prompt for prompt in transmitted_prompts)
        )

    @patch("requests.post")
    def test_when_linked_to_input_node_transmits_input_node_output_to_the_api(
        self, mock_post
    ):
        # Arrange
        expected_prompt = "Expected prompt"

        input_processor = InputProcessor(
            {
                "input": "",
                "name": "p00tklq5w#input-text",
                "processorType": "input-text",
                "inputText": expected_prompt,
            }
        )

        input_processor.set_output(expected_prompt)

        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "artifacts": [{"base64": "R0lGODlhAQABAAAAACw="}]
        }
        mock_post.return_value = mock_response

        config = self.get_default_valid_config()

        api_context_data = {"session_stabilityai_api_key": "fake_api_key"}
        processor = StableDiffusionStabilityAIPromptProcessor(config, api_context_data)
        processor.set_storage_strategy(LocalStorageStrategy())
        processor.set_input_processor(input_processor)

        # Act
        processor.process()

        # Assert
        called_args = mock_post.call_args[1]
        sent_json = called_args.get("json")
        transmitted_prompts = sent_json["text_prompts"]
        self.assertTrue(
            any(prompt["text"] == expected_prompt for prompt in transmitted_prompts)
        )
