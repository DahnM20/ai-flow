from queue import Queue
from concurrent.futures import ThreadPoolExecutor

task_queues = {}
task_processors = {}

executor = ThreadPoolExecutor(max_workers=10)


def register_task_processor(task_name, processor_func):
    task_queue = Queue()
    task_queues[task_name] = task_queue
    task_processors[task_name] = processor_func


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


def process_task(task_name, task_data, task_result_queue):
    if task_name in task_processors:
        processor_func = task_processors[task_name]
        result = processor_func(task_data)
        task_result_queue.put(result)
    else:
        raise ValueError(f"No task processor registered for {task_name}")


def add_task(task_name, task_data, result_queue):
    if task_name in task_queues:
        executor.submit(process_task, task_name, task_data, result_queue)
    else:
        raise ValueError(f"No task processor registered for {task_name}")
