import logging
import os
import asyncio
from asyncio import Queue
from queue import Empty
import time
from ...env_config import get_browser_tab_max_usage, get_browser_tab_pool_size
from playwright.async_api import async_playwright


class AsyncBrowserManager:
    def __init__(
        self, pool_size=10, max_usage=10
    ):  # Default pool size to 2 and max_usage to 10
        self.playwright = None
        self.browser = None
        self.pool_size = get_browser_tab_pool_size() if pool_size is None else pool_size
        self.max_usage = get_browser_tab_max_usage() if max_usage is None else max_usage
        self.lock = asyncio.Lock()
        self.tab_pool = Queue(maxsize=self.pool_size)
        self.tab_usage_count = {}

    async def initialize_browser(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        await self.initialize_pool()
        logging.info("Browser initialized")

    async def initialize_pool(self):
        for _ in range(self.pool_size):
            context = await self.browser.new_context()
            page = await context.new_page()
            await self.tab_pool.put((page, context))
            self.tab_usage_count[page] = 0

    async def close_browser(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def get_browser(self):
        if not self.browser:
            raise Exception("Browser not initialized")
        return self.browser

    async def _recycle_tab(self, page, context):
        try:
            await context.close()  # Close existing context to free memory
        except Exception as e:
            logging.error(f"Error closing context: {e}")
        context = await self.browser.new_context()
        page = await context.new_page()
        self.tab_usage_count[page] = 1
        return page, context

    async def get_tab(self, timeout=10):
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                async with self.lock:
                    page, context = await self.tab_pool.get()

                self.tab_usage_count[page] += 1
                if self.tab_usage_count[page] > self.max_usage:
                    # Recycle tab if max usage is reached
                    page, context = await self._recycle_tab(page, context)

                return page, context
            except Empty:
                await asyncio.sleep(0.1)  # Yield control to other tasks
        raise Exception("No available tabs in the pool after waiting")

    async def release_tab(self, page, context):
        async with self.lock:
            try:
                await page.goto(
                    "about:blank"
                )  # Clear the page by navigating to a blank page
                await context.clear_cookies()
                await self.tab_pool.put((page, context))
            except Exception as e:
                logging.error(f"Error releasing tab: {e}")
                # Recycle the tab if an error occurs during release
                page, context = await self._recycle_tab(page, context)
                await self.tab_pool.put((page, context))
