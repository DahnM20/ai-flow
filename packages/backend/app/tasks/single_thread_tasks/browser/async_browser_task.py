import logging
import re
import asyncio
import threading
from ....utils.web_scrapping.async_browser_manager import (
    AsyncBrowserManager,
)

browser_task_queue = None
event_loop = None


async def accept_cookies(page, cookies_consent_label, timeout=5000):
    try:
        await page.wait_for_selector(
            f"button:has-text('{cookies_consent_label}')", timeout=timeout
        )
        accept_button = page.locator(
            f"button:has-text('{cookies_consent_label}')"
        ).first
        if not accept_button:
            return
        await accept_button.click()
        await page.wait_for_timeout(2000)
    except Exception as e:
        logging.warning("Could not find or click the cookie accept button:", e)


def strip_attributes(html):
    return re.sub(r"(<\w+)(\s+[^>]+)?(>)", r"\1\3", html)


async def fetch_url_content(
    url,
    browser_manager,
    with_html_tags=False,
    with_html_attributes=False,
    selectors=None,
    selectors_to_remove=None,
    cookies_consent_label=None,
):
    page, context = await browser_manager.get_tab()
    try:
        await page.goto(url, timeout=30000)
    except Exception as e:
        logging.error(f"Failed to load page: {str(e)}")
        return ""
    try:
        if cookies_consent_label:
            await accept_cookies(page, cookies_consent_label)
        if selectors_to_remove:
            for selector in selectors_to_remove:
                elements = await page.query_selector_all(selector)
                for element in elements:
                    await page.evaluate("(element) => element.remove()", element)
        content = ""
        if selectors and len(selectors) > 0:
            for selector in selectors:
                elements = await page.query_selector_all(selector)
                for element in elements:
                    content_piece = (
                        await element.inner_html()
                        if with_html_tags
                        else await element.inner_text()
                    )
                    content += content_piece + "\n"
        else:
            content = (
                await page.content()
                if with_html_tags
                else await page.inner_text("body")
            )
        if with_html_tags and not with_html_attributes:
            content = strip_attributes(content)
    except Exception as e:
        logging.error(f"Error processing page content: {str(e)}")

        content = ""
    finally:
        await browser_manager.release_tab(page, context)
    return content


async def scrapping_task(task_data, browser_manager):
    selectors = task_data.get("selectors", [])
    selectors_to_remove = task_data.get("selectors_to_remove", [])
    with_html_tags = task_data.get("with_html_tags", False)
    with_html_attributes = task_data.get("with_html_attributes", False)
    url = task_data.get("url")
    cookies_consent_label = task_data.get("cookies_consent_label", None)
    content = await fetch_url_content(
        url,
        browser_manager,
        with_html_tags=with_html_tags,
        with_html_attributes=with_html_attributes,
        selectors=selectors,
        selectors_to_remove=selectors_to_remove,
        cookies_consent_label=cookies_consent_label,
    )
    return content


async def add_task(task_data, result_queue):
    await browser_task_queue.put((task_data, result_queue))


async def browser_task_worker():
    global browser_task_queue
    browser_task_queue = asyncio.Queue()
    browser_manager = AsyncBrowserManager()
    await browser_manager.initialize_browser()

    logging.info("Starting browser task worker")
    while True:
        task_data, result_queue = await browser_task_queue.get()
        if task_data is None:  # Exit signal
            logging.info("Exiting browser task worker")
            break
        try:
            result = await scrapping_task(task_data, browser_manager)
            result_queue.put(result)
        except Exception as e:
            logging.error(f"Error in browser task worker: {e}")
            import traceback

            traceback.print_exc()


event_loop = None


def start_event_loop():
    global event_loop
    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)
    event_loop.run_until_complete(browser_task_worker())
    event_loop.run_forever()


def stop_event_loop():
    event_loop.run_until_complete(browser_manager.close_browser())
    event_loop.stop()
    event_loop.close()


def add_task_sync(task_data, result_queue):
    future = asyncio.run_coroutine_threadsafe(
        add_task(task_data, result_queue), event_loop
    )
    return future


event_loop_thread = threading.Thread(target=start_event_loop)
event_loop_thread.start()
