import unittest
from unittest.mock import ANY, patch

from dotenv import load_dotenv

load_dotenv()

from app.flask.socketio_init import socketio

from app.processors.components.core.llm_prompt_processor import (
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
