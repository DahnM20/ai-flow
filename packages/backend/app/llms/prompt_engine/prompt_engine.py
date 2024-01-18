from abc import ABC, abstractmethod


class PromptEngine(ABC):
    @abstractmethod
    def prompt(self, messages):
        pass

    @abstractmethod
    def prompt_stream(self, messages):
        pass
