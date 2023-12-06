from queue import Empty, Queue
import time
import eventlet
from .processor import SimpleProcessor

from ...tasks.shared_ressources import scrapping_task_queue

from .processor_type_name_utils import URL_INPUT

class URLInputProcessor(SimpleProcessor):
    WAIT_TIMEOUT = 60
    processor_type = URL_INPUT

    def __init__(self, config):
        super().__init__(config)
        self.url = config["url"]

    def updateContext(self, data):
        pass

    def process(self):
        urls = [self.url]
        results_queue = Queue()
        
        content = None
        scrapping_task_queue.put((results_queue, urls))
        
        start_time = time.time()
        
        while True:
            try:
                content = results_queue.get_nowait()
                break
            except Empty:
                if time.time() - start_time > URLInputProcessor.WAIT_TIMEOUT :
                    content = "Timeout"
                    break
            
            eventlet.sleep(0.1)  # Sleep to prevent high CPU usage
        
        
        self.set_output(content)
        return content
