from queue import Empty
import time
import eventlet


def wait_for_result(queue, timeout=120, initial_sleep=0.1, max_sleep=5.0):
    start_time = time.time()
    sleep_duration = initial_sleep

    while True:
        try:
            result = queue.get_nowait()
            return result
        except Empty:
            if time.time() - start_time >= timeout:
                raise TimeoutError("Operation timed out after the specified timeout")

            eventlet.sleep(sleep_duration)
            sleep_duration = min(sleep_duration * 1.5, max_sleep)
