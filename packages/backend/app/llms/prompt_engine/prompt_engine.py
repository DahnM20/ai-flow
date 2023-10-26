from abc import ABC, abstractmethod

class PromptEngine(ABC):

    @abstractmethod
    def prompt(self, messages):
        pass