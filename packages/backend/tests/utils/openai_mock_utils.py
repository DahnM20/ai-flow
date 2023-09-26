from unittest.mock import Mock


def create_mocked_openai_response(
    model="gpt-4", api_key="000000000", response_content="Mocked Response"
):
    """
    Create a mocked response for OpenAI.

    :param model: The model to be used.
    :param api_key: The API key to be used.
    :param response_content: The content for the mocked response.
    :return: A mocked response for OpenAI.
    """
    mock_message = Mock()
    mock_message.content = response_content

    mock_choice = Mock()
    mock_choice.message = mock_message

    mock_response = Mock()
    mock_response.choices = [mock_choice]

    return mock_response
