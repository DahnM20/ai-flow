from queue import Empty, Queue
import time
import eventlet
from ....tasks.task_manager import add_task
from ..processor import BasicProcessor

from .processor_type_name_utils import ProcessorType
from ....tasks.task_manager import add_task, register_task_processor
from ....tasks.task_exception import TaskAlreadyRegisteredError


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
        urls = [self.url]
        results_queue = Queue()

        content = None

        self.register_background_task()
        add_task("scrapping", urls, results_queue)

        start_time = time.time()

        while True:
            try:
                content = results_queue.get_nowait()
                break
            except Empty:
                if time.time() - start_time > URLInputProcessor.WAIT_TIMEOUT:
                    content = "Timeout"
                    break

            eventlet.sleep(0.1)  # Sleep to prevent high CPU usage

        self.set_output(content)
        return content
