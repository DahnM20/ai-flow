import logging
from queue import Queue
import eventlet
from eventlet.green import threading


from .task_exception import TaskAlreadyRegisteredError

from ..env_config import get_background_task_max_workers

task_queues = {}
task_processors = {}
task_semaphores = {}

pool = eventlet.GreenPool(size=get_background_task_max_workers())


def register_task_processor(task_name, processor_func, max_concurrent_tasks=2):
    if task_name in task_queues:
        raise TaskAlreadyRegisteredError(task_name=task_name)

    task_queue = Queue()
    task_queues[task_name] = task_queue
    task_processors[task_name] = processor_func
    task_semaphores[task_name] = threading.Semaphore(max_concurrent_tasks)

    logging.info(
        f"Registered green pool task processor '{task_name}' with max_concurrent_tasks={max_concurrent_tasks}"
    )


def process_task(task_name, task_data, task_result_queue):
    semaphore = task_semaphores.get(task_name)
    if semaphore is not None:
        with semaphore:
            if task_name in task_processors:
                processor_func = task_processors[task_name]
                result = processor_func(task_data)
                task_result_queue.put(result)
            else:
                raise ValueError(f"Nao task processor registered for {task_name}")
    else:
        raise ValueError(f"No semaphore registered for {task_name}")


def add_task(task_name, task_data, result_queue):
    if task_name in task_queues:
        return pool.spawn(process_task, task_name, task_data, result_queue)
    else:
        raise ValueError(f"No task processor registered for {task_name}")
