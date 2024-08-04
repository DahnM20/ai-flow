import logging
import queue
import re
import threading
import time
from ....utils.web_scrapping.browser_manager import BrowserManager


browser_task_queue = queue.Queue()


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
    browser_manager,
    with_html_tags=False,
    with_html_attributes=False,
    selectors=None,
    selectors_to_remove=None,
    cookies_consent_label=None,
):
    page, context = browser_manager.get_tab()
    try:
        page.goto(url, timeout=30000)
    except Exception as e:
        logging.error(f"Failed to load page: {str(e)}")
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
                        element.inner_html() if with_html_tags else element.inner_text()
                    )
                    content += content_piece + "\n"
        else:
            content = page.content() if with_html_tags else page.inner_text("body")
        if with_html_tags and not with_html_attributes:
            content = strip_attributes(content)
    except Exception as e:
        logging.error(f"Error processing page content: {str(e)}")
        content = ""
    finally:
        browser_manager.release_tab(page, context)
    return content


def scrapping_task(task_data, browser_manager):

    selectors = task_data.get("selectors", [])
    selectors_to_remove = task_data.get("selectors_to_remove", [])
    with_html_tags = task_data.get("with_html_tags", False)
    with_html_attributes = task_data.get("with_html_attributes", False)
    url = task_data.get("url")
    cookies_consent_label = task_data.get("cookies_consent_label", None)
    content = fetch_url_content(
        url,
        browser_manager,
        with_html_tags=with_html_tags,
        with_html_attributes=with_html_attributes,
        selectors=selectors,
        selectors_to_remove=selectors_to_remove,
        cookies_consent_label=cookies_consent_label,
    )
    return content


def add_task_sync(task_data, result_queue):
    browser_task_queue.put((task_data, result_queue))


def browser_thread_func(task_queue):
    logging.info("Starting browser thread")
    browser_manager = BrowserManager()
    browser_manager.initialize_browser()

    while True:
        try:
            task_data, result_queue = task_queue.get()
            if task_data is None:  # Exit signal
                logging.info("Exiting browser thread")
                break

            result = scrapping_task(task_data, browser_manager)
            result_queue.put(result)

        except Exception as e:
            logging.error(f"Error in browser thread: {e}")
        finally:
            time.sleep(0.1)


def stop_browser_thread():
    browser_task_queue.put((None, None))
    browser_thread.join()


browser_thread = threading.Thread(
    target=browser_thread_func, args=(browser_task_queue,)
)
browser_thread.start()
