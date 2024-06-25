from queue import Queue
import re
import time

from ....utils.processor_utils import is_valid_url
from ....tasks.task_manager import add_task
from ..processor import BasicProcessor

from .processor_type_name_utils import ProcessorType
from ....tasks.task_manager import add_task, register_task_processor
from ....tasks.task_exception import TaskAlreadyRegisteredError
from ....tasks.task_utils import wait_for_result
import logging

from playwright.sync_api import sync_playwright


class URLInputProcessor(BasicProcessor):
    WAIT_TIMEOUT = 60
    processor_type = ProcessorType.URL_INPUT

    def __init__(self, config):
        super().__init__(config)

    @staticmethod
    def scrapping_task(task_data):

        def accept_cookies(page, cookies_consent_label, timeout=5000):
            try:
                page.wait_for_selector(
                    f"button:has-text('{cookies_consent_label}')", timeout=timeout
                )
                accept_button = page.locator(
                    f"button:has-text('{cookies_consent_label}')"
                ).first
                accept_button.click()
                page.wait_for_timeout(2000)
            except Exception as e:
                logging.warning("Could not find or click the cookie accept button:", e)

        def strip_attributes(html):
            return re.sub(r"(<\w+)(\s+[^>]+)?(>)", r"\1\3", html)

        def fetch_url_content(
            url,
            with_html_tags=False,
            with_html_attributes=False,
            selectors=None,
            selectors_to_remove=None,
            cookies_consent_label=None,
        ):
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                try:
                    page.goto(url, timeout=30000)
                except Exception as e:
                    logging.error(f"Failed to load page: {str(e)}")
                    browser.close()
                    return ""

                try:
                    if cookies_consent_label:
                        accept_cookies(page, cookies_consent_label)

                    if selectors_to_remove:
                        for selector in selectors_to_remove:
                            elements = page.query_selector_all(selector)
                            for element in elements:
                                page.evaluate("(element) => element.remove()", element)

                    content = ""
                    if selectors and len(selectors) > 0:
                        for selector in selectors:
                            elements = page.query_selector_all(selector)
                            for element in elements:
                                content_piece = (
                                    element.inner_html()
                                    if with_html_tags
                                    else element.inner_text()
                                )
                                content += content_piece + "\n"
                    else:
                        content = (
                            page.content()
                            if with_html_tags
                            else page.inner_text("body")
                        )

                    if with_html_tags and not with_html_attributes:
                        content = strip_attributes(content)
                except Exception as e:
                    logging.error(f"Error processing page content: {str(e)}")
                    content = ""
                finally:
                    browser.close()
            return content

        selectors = task_data.get("selectors", [])
        selectors_to_remove = task_data.get("selectors_to_remove", [])
        with_html_tags = task_data.get("with_html_tags", False)
        with_html_attributes = task_data.get("with_html_attributes", False)
        url = task_data.get("url")
        cookies_consent_label = task_data.get("cookies_consent_label", None)

        content = fetch_url_content(
            url,
            with_html_tags=with_html_tags,
            with_html_attributes=with_html_attributes,
            selectors=selectors,
            selectors_to_remove=selectors_to_remove,
            cookies_consent_label=cookies_consent_label,
        )
        return content

    def register_background_task(self):
        try:
            register_task_processor("scrapping", self.scrapping_task)
        except TaskAlreadyRegisteredError as e:
            pass

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

        self.register_background_task()

        task_data = {
            "url": self.url,
            "selectors": self.selectors,
            "selectors_to_remove": self.selectors_to_remove,
            "with_html_tags": self.with_html_tags,
            "with_html_attributes": self.with_html_attributes,
            "cookies_consent_label": self.cookies_consent_label,
        }

        add_task("scrapping", task_data, results_queue)
        try:
            content = wait_for_result(results_queue)
        except TimeoutError as e:
            raise TimeoutError("URL takes too long to load")

        self.set_output(content)
        return content
