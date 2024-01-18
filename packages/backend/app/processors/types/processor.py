from abc import ABC, abstractmethod
import logging
from typing import Any, List, Optional, TypedDict, Union, Dict

from ..launcher.processor_event import ProcessorEvent
from ..launcher.event_type import EventType

from ..observer.observer import Observer

from .processor_type_name_utils import ProcessorType

from ...storage.storage_strategy import StorageStrategy

from ..context.processor_context import ProcessorContext


class BadKeyInputIndex(Exception):
    """Exception raised for index out of bounds in the output list."""

    def __init__(self, message="This input key does not exists"):
        self.message = message
        super().__init__(self.message)


class InputItem(TypedDict, total=False):
    inputName: Optional[str]
    inputNode: str
    inputNodeOutputKey: int


class Processor(ABC):
    processor_type: Optional["ProcessorType"] = None
    """The type of the processor"""

    observers: List[Observer] = []
    """The observers of the processor"""

    storage_strategy: Optional["StorageStrategy"]
    """The storage strategy used by the processor"""

    api_context_data: Optional["ProcessorContext"]
    """The context data of the processor"""

    name: str
    """The name of the processor"""

    _output: Optional[Any]
    """The output of the processor"""

    inputs: Optional[List[InputItem]]
    """A list of inputs accepted by the processor."""

    input_processors: List["Processor"]
    """The processors set as inputs"""

    is_finished: bool
    """Flag indicating if the processor's has produced his output"""

    _has_dynamic_behavior: bool
    """Flag indicating if the processor's behavior and execution time are unpredictable and subject to change at runtime."""

    def __init__(self, config: Dict[str, Any]) -> None:
        self.name = config["name"]
        self.processor_type = config["processorType"]
        self.observers = []
        self._output = None
        self.inputs = None
        self.api_context_data = None
        self.input_processors = []
        self.storage_strategy = None
        self.is_finished = False
        self._has_dynamic_behavior = False
        if config.get("inputs") is not None and config.get("inputs") != []:
            self.inputs = config.get("inputs")

    def cleanup(self) -> None:
        self.input_processors = None
        self.api_context_data = None
        self._output = None
        self.storage_strategy = None

    @abstractmethod
    def process(self):
        pass

    @abstractmethod
    def cancel(self) -> None:
        pass

    @abstractmethod
    def update_context(self, data: Any) -> None:
        pass

    def add_observer(self, observer):
        self.observers.append(observer)

    def remove_observer(self, observer):
        self.observers.remove(observer)
        if len(self.observers) == 0:
            self.observers = None
        return self.observers

    def notify(self, event: EventType, data: ProcessorEvent):
        for observer in self.observers:
            observer.notify(event, data)

    def get_output(self, input_key=None) -> Optional[str]:
        output = getattr(self, "_output", None)
        if output is not None and isinstance(output, list) and len(output) > 0:
            if input_key is not None:
                if input_key < 0 or input_key >= len(output):
                    raise BadKeyInputIndex(
                        f"Index {input_key} out of bounds for output of size {len(output)}."
                    )
                return output[input_key]
            else:
                return output
        return None

    def set_output(self, value: Union[List, str]) -> None:
        if isinstance(value, list):
            self._output = value
        elif isinstance(value, str):
            self._output = [value]
        else:
            raise TypeError("Value should be either a list or a string.")
        self.is_finished = True

    def get_input_processor(self) -> Optional["Processor"]:
        if self.input_processors is None or len(self.input_processors) == 0:
            return None
        return self.input_processors[0]

    def get_input_processors(self) -> List["Processor"]:
        return self.input_processors

    def get_input_node_output_key(self) -> Optional[int]:
        if self.inputs is None or len(self.inputs) == 0:
            return None
        if self.inputs[0].get("inputNodeOutputKey") is None:
            return 0
        return self.inputs[0].get("inputNodeOutputKey")

    def get_input_node_output_keys(self) -> Optional[List[int]]:
        if self.inputs is None or len(self.inputs) == 0:
            return None
        return [input.get("inputNodeOutputKey") for input in self.inputs]

    def get_input_names(self) -> Optional[List[str]]:
        if self.inputs is None or len(self.inputs) == 0:
            return None
        return [input.get("inputName") for input in self.inputs]

    def add_input_processor(self, input_processor: "Processor") -> None:
        self.input_processors.append(input_processor)

    def set_storage_strategy(self, storage_strategy: "StorageStrategy") -> None:
        self.storage_strategy = storage_strategy

    def __str__(self) -> str:
        return f"Processor(name={self.name}, type={self.processor_type}, x={self.x}, y={self.y})"

    def get_storage(self) -> Optional["StorageStrategy"]:
        return self.storage_strategy

    def has_dynamic_behavior(self) -> bool:
        return self._has_dynamic_behavior


class SimpleProcessor(Processor):
    def __init__(self, config):
        super().__init__(config)

    def cancel(self):
        pass

    def get_api_key(self, key_name):
        pass


class APIContextProcessor(Processor):
    def __init__(self, config, api_context_data: ProcessorContext = None):
        super().__init__(config)
        self.api_context_data = api_context_data
