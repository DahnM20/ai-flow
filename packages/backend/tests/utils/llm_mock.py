from llama_index.llms.base import BaseLLM

from llama_index.llms.base import ChatMessage
from llama_index.llms.base import ChatResponse

from typing import (
    Any,
    List,
    Sequence,
    Union,
)


class MockedStreamObject:
    def __init__(self, delta):
        self.delta = delta


class LLMMock(BaseLLM):
    expected_response: Union[str, List[str]]

    def __init__(self, expected_response=None, **data):
        if expected_response is None:
            expected_response = "Mocked response"
        super().__init__(expected_response=expected_response, **data)

    def chat(self, messages: Sequence[ChatMessage], **kwargs: Any) -> ChatResponse:
        msg = ChatMessage(content=self.expected_response)
        return ChatResponse(message=msg)

    def metadata(self):
        """LLM metadata."""
        pass

    def complete(self, prompt: str, **kwargs: Any):
        """Completion endpoint for LLM."""
        pass

    def stream_chat(self, messages: Sequence[ChatMessage], **kwargs: Any):
        """Streaming chat endpoint for LLM."""
        stream_mocked = [
            MockedStreamObject(response) for response in self.expected_response
        ]
        return stream_mocked

    def stream_complete(self, prompt: str, **kwargs: Any):
        """Streaming completion endpoint for LLM."""
        pass

    # ===== Async Endpoints =====
    async def achat(
        self, messages: Sequence[ChatMessage], **kwargs: Any
    ) -> ChatResponse:
        """Async chat endpoint for LLM."""
        pass

    async def acomplete(self, prompt: str, **kwargs: Any):
        """Async completion endpoint for LLM."""
        pass

    async def astream_chat(self, messages: Sequence[ChatMessage], **kwargs: Any):
        """Async streaming chat endpoint for LLM."""
        pass

    async def astream_complete(self, prompt: str, **kwargs: Any):
        """Async streaming completion endpoint for LLM."""
        pass

    def class_name(cls) -> str:
        """
        Get the class name, used as a unique ID in serialization.

        This provides a key that makes serialization robust against actual class
        name changes.
        """
        return "LLMMock"
