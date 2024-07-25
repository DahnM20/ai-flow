from queue import Queue

from ....env_config import use_async_browser

if use_async_browser():
    from ....tasks.single_thread_tasks.browser.async_browser_task import add_task_sync
else:
    from ....tasks.single_thread_tasks.browser.browser_task import add_task_sync

from ....utils.processor_utils import is_valid_url
from ..processor import BasicProcessor

from .processor_type_name_utils import ProcessorType
from ....tasks.task_utils import wait_for_result
import logging


class URLInputProcessor(BasicProcessor):
    WAIT_TIMEOUT = 60
    processor_type = ProcessorType.URL_INPUT

    def __init__(self, config):
        super().__init__(config)

    def process(self):

        self.url = self.get_input_by_name("url")
        if not is_valid_url(self.url):
            raise ValueError("Invalid URL")

        self.selectors = self.get_input_by_name("selectors", [])
        self.selectors_to_remove = self.get_input_by_name("selectors_to_remove", [])
        self.with_html_tags = self.get_input_by_name("with_html_tags", False)
        self.with_html_attributes = self.get_input_by_name(
            "with_html_attributes", False
        )
        self.cookies_consent_label = self.get_input_by_name(
            "cookies_consent_label", None
        )

        results_queue = Queue()

        content = None

        task_data = {
            "url": self.url,
            "selectors": self.selectors,
            "selectors_to_remove": self.selectors_to_remove,
            "with_html_tags": self.with_html_tags,
            "with_html_attributes": self.with_html_attributes,
            "cookies_consent_label": self.cookies_consent_label,
        }

        add_task_sync(task_data, results_queue)
        try:
            content = wait_for_result(results_queue)
        except TimeoutError as e:
            raise TimeoutError("URL takes too long to load")

        return content
