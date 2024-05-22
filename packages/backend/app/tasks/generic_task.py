import logging
import threading
from queue import Queue

# Define a dictionary to store different task queues
task_queues = {}
task_processors = {}


def register_task_processor(task_name, processor_func):
    task_queue = Queue()
    task_queues[task_name] = task_queue
    task_processors[task_name] = processor_func

    def task_processor():
        logging.info(f"Starting background thread for {task_name}")
        while True:
            # The get() method will block if the queue is empty and wait for a new item
            task_result_queue, task_data = task_queue.get()
            result = processor_func(task_data)
            task_result_queue.put(result)

    background_thread = threading.Thread(target=task_processor)
    background_thread.daemon = True
    background_thread.start()


def scrapping_task_processor(urls):
    from langchain.document_loaders import PlaywrightURLLoader

    loader = PlaywrightURLLoader(urls=urls, remove_selectors=["header", "footer"])
    documents = loader.load()
    content = " ".join(doc.page_content for doc in documents)
    return content


def document_loader_task(loader):
    return loader.load()


register_task_processor("scrapping", scrapping_task_processor)
register_task_processor("document_loader", document_loader_task)


def add_task(task_name, task_data, result_queue):
    if task_name in task_queues:
        task_queues[task_name].put((result_queue, task_data))
    else:
        raise ValueError(f"No task processor registered for {task_name}")
