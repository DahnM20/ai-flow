import time
import logging


class RetryMixin:
    def run_with_retry(self, func, *args, **kwargs):
        """
        Executes `func` with retries as defined in the processor configuration.
        Expected configuration keys:
            - max_retries: number of extra attempts (default 0 means no retry)
            - retry_delay: delay (in seconds) between attempts (default 0)
        """
        retries = getattr(self, "max_retries", 0)
        delay = getattr(self, "retry_delay", 0)
        for attempt in range(retries + 1):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logging.warning(
                    f"Attempt {attempt+1}/{retries+1} for {func.__name__} failed"
                )
                if attempt == retries:
                    raise
                if delay:
                    time.sleep(delay)
