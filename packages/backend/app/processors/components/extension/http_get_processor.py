import logging
import requests
import json
from urllib.parse import urlparse

from ..node_config_builder import FieldBuilder, NodeConfigBuilder
from ...context.processor_context import ProcessorContext
from .extension_processor import ContextAwareExtensionProcessor


class HttpGetProcessor(ContextAwareExtensionProcessor):
    processor_type = "http-get-processor"
    max_timeout = 5  # Maximum timeout in seconds
    max_response_size_in_mb = 2
    max_response_size = (
        1024 * 1024 * max_response_size_in_mb
    )  # Maximum response size in bytes (2 MB)

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

    def get_node_config(self):
        url_field = (
            FieldBuilder()
            .set_name("url")
            .set_label("URL")
            .set_type("textfield")
            .set_required(True)
            .set_placeholder("httpGetProcessorURLPlaceholder")
            .set_description("httpGetProcessorURLDescription")
            .set_has_handle(True)
            .build()
        )

        headers_field = (
            FieldBuilder()
            .set_name("headers")
            .set_label("Headers")
            .set_type("dictionnary")
            .set_description("httpGetProcessorHeadersDescription")
            .build()
        )

        return (
            NodeConfigBuilder()
            .set_node_name("HTTP Get")
            .set_processor_type(self.processor_type)
            .set_icon("TbHttpGet")
            .set_section("input")
            .set_help_message("httpGetProcessorHelp")
            .set_output_type("text")
            .set_show_handles(True)
            .add_field(url_field)
            .add_field(headers_field)
            .build()
        )

    def convert_headers_array_to_json(self, headers_array):
        headers = {}
        for header in headers_array:
            headers[header["key"]] = header["value"]
        return json.dumps(headers)

    def process(self):
        url = self.get_input_by_name("url")
        headers = self.get_input_by_name("headers")
        timeout = self.get_input_by_name("timeout")

        if not url:
            raise ValueError("URL is required.")

        # Validate URL to prevent misuse
        parsed_url = urlparse(url)
        if not parsed_url.scheme.startswith("http"):
            raise ValueError("Invalid URL scheme. Only HTTP and HTTPS are allowed.")

        timeout = HttpGetProcessor.max_timeout

        if headers:
            headers = self.convert_headers_array_to_json(headers)
            try:
                headers = json.loads(headers)

            except json.JSONDecodeError:
                raise Exception("Headers must be a valid JSON.")
        else:
            headers = {}

        try:
            response = requests.get(
                url=url,
                headers=headers,
                timeout=timeout,
                allow_redirects=False,
                stream=True,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logging.warning(f"HTTP GET request failed: {str(e)}")
            raise Exception(f"HTTP GET request failed: {str(e)}")

        # Limit the response size
        content = bytes()
        total_size = 0
        try:
            for chunk in response.iter_content(chunk_size=8192):
                content += chunk
                total_size += len(chunk)
                if total_size > HttpGetProcessor.max_response_size:
                    logging.warning("Response size exceeds maximum allowed limit.")
                    raise Exception(
                        f"Response size exceeds maximum allowed limit of {HttpGetProcessor.max_response_size_in_mb} MB. If need to load file, consider using the file node in URL mode."
                    )
        finally:
            response.close()

        content_type = response.headers.get("Content-Type", "")

        if "application/json" in content_type:
            try:
                return [json.loads(content.decode(response.encoding or "utf-8"))]

            except ValueError:
                raise Exception("Failed to parse JSON response.")
        else:
            return content.decode(response.encoding or "utf-8", errors="replace")

    def cancel(self):
        pass
