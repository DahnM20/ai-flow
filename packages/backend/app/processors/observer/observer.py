from abc import ABC, abstractmethod


class Observer(ABC):
    @abstractmethod
    def notify(self, event, data):
        pass
