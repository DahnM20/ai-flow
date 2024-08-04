import logging
import asyncio
from asyncio import Queue
from queue import Empty
import tempfile
import time
import zipfile

from ...env_config import get_browser_tab_max_usage, get_browser_tab_pool_size
from playwright.async_api import async_playwright


class AsyncBrowserManager:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.pool_size = get_browser_tab_pool_size()
        self.max_usage = get_browser_tab_max_usage()
        self.lock = asyncio.Lock()
        self.tab_pool = Queue(maxsize=self.pool_size)
        self.tab_usage_count = {}

    async def initialize_browser(self):
        self.playwright = await async_playwright().start()
        await self.initialize_pool()
        logging.info("Browser initialized")

    def unzip_extension(zip_path, extract_to):
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(extract_to)

    async def launch_context(self):
        user_data_dir = tempfile.mkdtemp()
        args = []
        args.append("--headless=new")

        context = await self.playwright.chromium.launch_persistent_context(
            user_data_dir,
            headless=False,
            args=args,
            viewport={"width": 1920, "height": 1080},
        )

        return context

    async def initialize_pool(self):
        for _ in range(self.pool_size):
            context = await self.launch_context()
            page = await context.new_page()
            await self.tab_pool.put((page, context))
            self.tab_usage_count[page] = 0

    async def check_extensions_loaded(self, take_extensions_screenshot=False):
        page, context = await self.get_tab()
        await page.goto("chrome://extensions/")

        # Wait for the extensions list to load
        await page.wait_for_selector("extensions-manager")

        # Extract the extensions displayed
        extensions = await page.evaluate(
            """() => {
            return new Promise((resolve, reject) => {
                try {
                    chrome.management.getAll((extensions) => {
                        resolve(extensions);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }"""
        )

        extension_names = [ext["name"] for ext in extensions]
        logging.info(f"Extensions loaded in Chromium : {extension_names}")
        if take_extensions_screenshot:
            screenshot_path = "extensions_screenshot.png"
            await page.screenshot(path=screenshot_path)
            logging.info(f"Screenshot saved to {screenshot_path}")

    async def close_browser(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def _recycle_tab(self, page, context):
        try:
            await context.close()  # Close existing context to free memory
        except Exception as e:
            logging.error(f"Error closing context: {e}")
        context = await self.launch_context()
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
                await context.clear_cookies()
                await self.tab_pool.put((page, context))
            except Exception as e:
                logging.error(f"Error releasing tab: {e}")
                # Recycle the tab if an error occurs during release
                page, context = await self._recycle_tab(page, context)
                await self.tab_pool.put((page, context))
