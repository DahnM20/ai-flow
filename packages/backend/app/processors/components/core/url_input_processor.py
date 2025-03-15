import random
from bs4 import BeautifulSoup

import requests

from ....utils.processor_utils import is_valid_url
from ..processor import BasicProcessor

from .processor_type_name_utils import ProcessorType
import logging
from markdownify import markdownify


class URLInputProcessor(BasicProcessor):
    WAIT_TIMEOUT = 60
    GET_TIMEOUT = 20
    processor_type = ProcessorType.URL_INPUT

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0",
    ]

    def __init__(self, config):
        super().__init__(config)

    def get_random_user_agent():
        return random.choice(URLInputProcessor.USER_AGENTS)

    def fetch_content_simple(self):
        """
        Fetches the website content using a simple GET request.
        """
        try:
            headers = {"User-Agent": URLInputProcessor.get_random_user_agent()}
            response = requests.get(self.url, headers=headers, timeout=self.GET_TIMEOUT)

            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logging.warning(f"Failed to fetch content using simple GET: {e}")
            return None

    def process(self):
        self.url = self.get_input_by_name("url")
        self.loading_mode = self.get_input_by_name("loading_mode", "browser")
        self.effective_load_mode = self.loading_mode

        # Validate URL input
        if not self.url or not isinstance(self.url, str) or self.url.strip() == "":
            raise Exception("No URL provided.", "noURLProvided")

        self.url = self.url.strip()
        self.original_url = self.url

        if not (self.url.startswith("https://") or self.url.startswith("http://")):
            logging.warning(
                "URL does not start with 'https://' or 'http://' - compensating by prepending 'https://'."
            )
            self.url = "https://" + self.url

        if not is_valid_url(self.url):
            logging.warning(f"Invalid URL: {self.url}")
            raise Exception(
                f"The provided URL '{self.original_url}' is not valid.\n\n"
                "Please ensure the URL follows the correct format, e.g., 'https://www.example.com' or 'https://example.com'."
            )

        # Get additional parameters
        self.selectors = self.get_input_by_name("selectors", [])
        self.selectors_to_remove = self.get_input_by_name("selectors_to_remove", [])
        self.with_html_tags = self.get_input_by_name("with_html_tags", False)
        self.with_html_attributes = self.get_input_by_name(
            "with_html_attributes", False
        )

        response = None

        task_data = {
            "url": self.url,
            "selectors": self.selectors,
            "selectors_to_remove": self.selectors_to_remove,
            "with_html_tags": self.with_html_tags,
            "with_html_attributes": self.with_html_attributes,
        }

        content = self.fetch_content_simple()
        response = self.process_content_with_beautiful_soup(content, task_data)

        return response

    def process_content_with_beautiful_soup(self, content, task_data):
        """
        Process the HTML content using BeautifulSoup while considering the following parameters:
        - selectors: a list of CSS selectors; if provided, only matching elements are kept.
        - selectors_to_remove: a list of CSS selectors for elements that should be removed.
        - with_html_tags: if True, the returned result will include HTML tags; otherwise, plain text.
        - with_html_attributes: if True (and with_html_tags is True), HTML attributes will be kept;
            otherwise, they will be stripped.
        """
        if not content:
            return ""

        soup = BeautifulSoup(content, "html.parser")

        selectors = task_data.get("selectors", [])
        if isinstance(selectors, str):
            selectors = [selectors]

        selectors_to_remove = task_data.get("selectors_to_remove", [])
        if isinstance(selectors_to_remove, str):
            selectors_to_remove = [selectors_to_remove]

        for selector in selectors_to_remove:
            for element in soup.select(selector):
                element.decompose()

        if selectors:
            selected_elements = soup.select(", ".join(selectors))
            if not selected_elements:
                selected_elements = [soup]
        else:
            selected_elements = [soup]

        with_html_tags = task_data.get("with_html_tags", False)
        with_html_attributes = task_data.get("with_html_attributes", False)

        if with_html_tags:
            if not with_html_attributes:
                for element in selected_elements:
                    if hasattr(element, "attrs"):
                        element.attrs = {}
                    for tag in element.find_all(True):
                        tag.attrs = {}
            html_output = "".join(str(element) for element in selected_elements)
            return html_output
        else:
            html_output = "".join(str(element) for element in selected_elements)
            text_output = markdownify(html_output)
            return text_output
