from queue import Queue

from ....utils.processor_utils import is_valid_url
from ....tasks.task_manager import add_task
from ..processor import BasicProcessor

from .processor_type_name_utils import ProcessorType
from ....tasks.task_manager import add_task, register_task_processor
from ....tasks.task_exception import TaskAlreadyRegisteredError
from ....tasks.task_utils import wait_for_result
import logging


class URLInputProcessor(BasicProcessor):
    WAIT_TIMEOUT = 60
    processor_type = ProcessorType.URL_INPUT

    def __init__(self, config):
        super().__init__(config)
        self.url = config["url"]

    def scrapping_task(urls):
        from langchain.document_loaders import PlaywrightURLLoader

        loader = PlaywrightURLLoader(urls=urls, remove_selectors=["header", "footer"])
        documents = loader.load()
        content = " ".join(doc.page_content for doc in documents)
        return content

    def register_background_task(self):
        try:
            register_task_processor("scrapping", self.scrapping_task)
        except TaskAlreadyRegisteredError as e:
            pass

    def process(self):
        if not is_valid_url(self.url):
            raise ValueError("Invalid URL")
        urls = [self.url]
        results_queue = Queue()

        content = None

        self.register_background_task()
        add_task("scrapping", urls, results_queue)
        try:
            content = wait_for_result(results_queue)
        except TimeoutError as e:
            raise TimeoutError("URL takes too long to load")

        self.set_output(content)
        return content
