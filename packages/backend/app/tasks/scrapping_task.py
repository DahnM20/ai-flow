import logging
import threading
from langchain.document_loaders import PlaywrightURLLoader
from .shared_ressources import scrapping_task_queue

def scrapping_task_processor():
    logging.info("Starting background thread for Playwright")
    
    loader = PlaywrightURLLoader(urls=[], remove_selectors=["header", "footer"])
    while True:
        # The get() method will block if the queue is empty and wait for a new item
        task_result_queue, urls = scrapping_task_queue.get()
        
        loader.urls = urls

        documents = loader.load()
        content = " ".join(doc.page_content for doc in documents)

        task_result_queue.put(content)


background_thread = threading.Thread(target=scrapping_task_processor)
background_thread.daemon = True
background_thread.start()