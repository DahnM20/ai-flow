import logging
import os
from queue import Empty, Queue
import time
import threading
from ...env_config import get_browser_tab_max_usage, get_browser_tab_pool_size
from playwright.sync_api import sync_playwright


class BrowserManager:
    def __init__(self, pool_size=None, max_usage=None):
        self.playwright = None
        self.browser = None
        self.pool_size = get_browser_tab_pool_size() if pool_size is None else pool_size
        self.max_usage = get_browser_tab_max_usage() if max_usage is None else max_usage
        self.lock = threading.Lock()
        self.tab_pool = Queue(maxsize=self.pool_size)
        self.tab_usage_count = {}

    def initialize_browser(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=True)
        self.initialize_pool()
        logging.info("Browser initialized")

    def initialize_pool(self):
        for _ in range(self.pool_size):
            context = self.browser.new_context()
            page = context.new_page()
            self.tab_pool.put((page, context))
            self.tab_usage_count[page] = 0

    def close_browser(self):
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()

    def get_browser(self):
        if not self.browser:
            raise Exception("Browser not initialized")
        return self.browser

    def _recycle_tab(self, page, context):
        context.close()
        context = self.browser.new_context()
        page = context.new_page()
        self.tab_usage_count[page] = 1
        return page, context

    def get_tab(self, timeout=10):
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                with self.lock:
                    page, context = self.tab_pool.get_nowait()

                self.tab_usage_count[page] += 1
                if self.tab_usage_count[page] > self.max_usage:
                    # Recycle tab if max usage is reached
                    page, context = self._recycle_tab(page, context)

                return page, context
            except Empty:
                time.sleep(0.1)  # Yield control to other threads
        raise Exception("No available tabs in the pool after waiting")

    def release_tab(self, page, context):
        with self.lock:
            page.goto("about:blank")  # Clear the page by navigating to a blank page
            context.clear_cookies()

            self.tab_pool.put((page, context))
