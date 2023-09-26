import os
from abc import ABC, abstractmethod
from typing import List, Union
from ..env_config import is_cloud_env
from ..storage.s3_storage_strategy import S3StorageStrategy
from ..storage.local_storage_strategy import LocalStorageStrategy


class BadKeyInputIndex(Exception):
    """Exception raised for index out of bounds in the output list."""

    def __init__(self, message="This input key does not exists"):
        self.message = message
        super().__init__(self.message)


class Processor(ABC):
    processor_type = None

    def __init__(self, config, api_context_data):
        self.name = config["name"]
        self.processor_type = config["processorType"]
        self.x = config.get("x")
        self.y = config.get("y")
        self._output = None
        self.api_context_data = api_context_data
        if config.get("input") is not None and config.get("input") != "":
            self.input = config.get("input")
        self.input_key = config.get("inputKey", 0)

    @abstractmethod
    def process(self):
        pass

    @abstractmethod
    def updateContext(self, data):
        pass

    # def get_output(self):
    #     return getattr(self, 'output', None)

    def get_output(self, input_key=None):
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

    def set_input_processor(self, input_processor):
        self.input_processor = input_processor

    def get_api_key(self, key_name):
        api_key = self.api_context_data.get(key_name)

        if api_key is None:
            raise Exception(f"No {key_name} Provided")

        return api_key

    def __str__(self):
        return f"Processor(name={self.name}, type={self.processor_type}, x={self.x}, y={self.y})"

    def get_storage(self):
        if is_cloud_env():
            return S3StorageStrategy()
        else:
            return LocalStorageStrategy()
