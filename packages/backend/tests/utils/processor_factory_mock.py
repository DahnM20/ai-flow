import logging
import random
import eventlet
import time

from injector import singleton
from unittest.mock import MagicMock
from app.processors.factory.processor_factory_iter_modules import (
    ProcessorFactoryIterModules,
)

from app.processors.components.core.processor_type_name_utils import (
    ProcessorType,
)
from .processor_context_mock import ProcessorContextMock

from app.processors.components.core.processor_type_name_utils import (
    ProcessorType,
)
from .processor_context_mock import ProcessorContextMock


@singleton
class ProcessorFactoryMock(ProcessorFactoryIterModules):
    MIN_DELAY = 0.1
    MAX_DELAY = 1

    NON_MOCKED_PROCESSORS = [
        ProcessorType.INPUT_TEXT.value,
        ProcessorType.INPUT_IMAGE.value,
        ProcessorType.URL_INPUT.value,
        ProcessorType.DISPLAY.value,
        ProcessorType.TRANSITION.value,
    ]

    def __init__(
        self,
        fake_text_output=None,
        fake_img_output=None,
        fake_multiple_output=None,
        with_delay=False,
        sleep_duration=None,
    ):
        super().__init__()
        self._mock_processors = {}
        self.fake_text_output = fake_text_output
        self.fake_img_output = fake_img_output
        self.fake_multiple_output = fake_multiple_output
        self.with_delay = with_delay

    def create_mock_processor(
        self, config, processor_type: ProcessorType, processor_class: str
    ):
    def create_mock_processor(
        self, config, processor_type: ProcessorType, processor_class: str
    ):
        mock_processor = MagicMock(spec=processor_class)

        mock_processor.name = config.get("name", "default_processor_name")
        mock_processor.processor_type = processor_type
        mock_processor.input_processors = []
        mock_processor._processor_context = ProcessorContextMock("")
        mock_processor._processor_context = ProcessorContextMock("")

        if config.get("inputs") is not None and config.get("inputs") != []:
            mock_processor.inputs = config.get("inputs")

        def fake_process(*args, **kwargs):
            if self.with_delay:
                sleep_duration = random.uniform(
                    ProcessorFactoryMock.MIN_DELAY, ProcessorFactoryMock.MAX_DELAY
                )
                eventlet.sleep(sleep_duration)

            if config.get("sleepDuration") is not None:
                sleep_duration = config.get("sleepDuration")
                logging.info(f"Sleeping for {sleep_duration} seconds")
                eventlet.sleep(sleep_duration)
                logging.info("Awake")

            if mock_processor.processor_type in [
                ProcessorType.DALLE_PROMPT.value,
                ProcessorType.STABLE_DIFFUSION_STABILITYAI_PROMPT.value,
                ProcessorType.DALLE_PROMPT.value,
                ProcessorType.STABLE_DIFFUSION_STABILITYAI_PROMPT.value,
            ]:
                output = (
                    [self.fake_img_output]
                    if self.fake_img_output is not None
                    else [
                        "https://ai-flow-public-assets.s3.eu-west-3.amazonaws.com/v0.4.0-sample-1.png"
                    ]
                )
            elif mock_processor.processor_type in [
                ProcessorType.AI_DATA_SPLITTER.value
            ]:
            elif mock_processor.processor_type in [
                ProcessorType.AI_DATA_SPLITTER.value
            ]:
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
            mock_processor.is_finished = True
            mock_processor.is_finished = True
            return output

        def fake_process_raise_error(*args, **kwargs):
            logging.error("MockProcessor - Fake Error")
            raise Exception("Mock Processor error")

        def fake_add_input_processor(input_processor):
            mock_processor.input_processors.append(input_processor)

        def get_input_processors():
            return mock_processor.input_processors

        def fake_has_dynamic_behavior():
            return False

        def fake_get_input_by_name(input_name, default_value=""):
            return default_value

        def fake_has_dynamic_behavior():
            return False

        def fake_get_input_by_name(input_name, default_value=""):
            return default_value

        mock_processor.process_and_update = (
            fake_process
            if config.get("raiseError", False) == False
            else fake_process_raise_error
        )
        mock_processor.add_input_processor = fake_add_input_processor
        mock_processor.get_input_processors = get_input_processors
        mock_processor.has_dynamic_behavior = fake_has_dynamic_behavior
        mock_processor.get_input_by_name = fake_get_input_by_name
        mock_processor.has_dynamic_behavior = fake_has_dynamic_behavior
        mock_processor.get_input_by_name = fake_get_input_by_name

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
