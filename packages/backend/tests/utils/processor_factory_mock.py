import logging
import random
import eventlet
import time

from injector import singleton
from unittest.mock import MagicMock
from app.processors.factory.processor_factory_iter_modules import (
    ProcessorFactoryIterModules,
)


@singleton
class ProcessorFactoryMock(ProcessorFactoryIterModules):
    MIN_DELAY = 0.1
    MAX_DELAY = 1

    NON_MOCKED_PROCESSORS = ["input-text", "input-image"]

    def __init__(
        self,
        fake_text_output=None,
        fake_img_output=None,
        fake_multiple_output=None,
        with_delay=False,
    ):
        super().__init__()
        self._mock_processors = {}
        self.fake_text_output = fake_text_output
        self.fake_img_output = fake_img_output
        self.fake_multiple_output = fake_multiple_output
        self.with_delay = with_delay

    def create_mock_processor(self, config, processor_type, processor_class):
        mock_processor = MagicMock(spec=processor_class)

        mock_processor.name = config.get("name", "default_processor_name")
        mock_processor.processor_type = processor_type
        mock_processor.input_processors = []

        if config.get("inputs") is not None and config.get("inputs") != []:
            mock_processor.inputs = config.get("inputs")

        def fake_process(*args, **kwargs):
            if self.with_delay:
                sleep_duration = random.uniform(
                    ProcessorFactoryMock.MIN_DELAY, ProcessorFactoryMock.MAX_DELAY
                )
                eventlet.sleep(sleep_duration)

            if mock_processor.processor_type in [
                "dalle-prompt",
                "stable-diffusion-stabilityai-prompt",
            ]:
                output = (
                    [self.fake_img_output]
                    if self.fake_img_output is not None
                    else [
                        "https://ai-flow-public-assets.s3.eu-west-3.amazonaws.com/v0.4.0-sample-1.png"
                    ]
                )
            elif mock_processor.processor_type in ["ai-data-splitter"]:
                output = (
                    self.fake_multiple_output
                    if self.fake_multiple_output is not None
                    else ["Lorem Ipsum", "Lorem Ipsum"]
                )
            else:
                output = (
                    self.fake_text_output
                    if self.fake_text_output is not None
                    else "Lorem Ipsum"
                )
            mock_processor.set_output(output)
            return output

        def fake_process_raise_error(*args, **kwargs):
            logging.error("MockProcessor - Fake Error")
            raise Exception("Mock Processor error")

        def fake_add_input_processor(input_processor):
            mock_processor.input_processors.append(input_processor)

        def get_input_processors():
            return mock_processor.input_processors

        mock_processor.process_and_update = (
            fake_process
            if config.get("raiseError", False) == False
            else fake_process_raise_error
        )
        mock_processor.add_input_processor = fake_add_input_processor
        mock_processor.get_input_processors = get_input_processors

        self._mock_processors[processor_type] = mock_processor

        return mock_processor

    def create_processor(self, config, context=None, storage_strategy=None):
        processor_type = config["processorType"]
        processor_class = self._processors.get(processor_type)
        if not processor_class:
            raise ValueError(f"Processor type '{processor_type}' not supported")

        if (
            processor_type in ProcessorFactoryMock.NON_MOCKED_PROCESSORS
            and config.get("raiseError", False) == False
        ):
            processor = processor_class(config=config)
        else:
            processor = self.create_mock_processor(
                config, processor_type, processor_class
            )

        return processor
