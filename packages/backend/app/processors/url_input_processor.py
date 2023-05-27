from .processor import Processor
from langchain.document_loaders.url import UnstructuredURLLoader

class URLInputProcessor(Processor):
    processor_type = "url_input"
    
    def __init__(self, config):
        super().__init__(config)
        self.url = config["url"]

    def updateContext(self, data):
        pass
    
    def process(self):
        urls = [self.url]
        loader = UnstructuredURLLoader(urls)

        documents = loader.load()
        content = ' '.join(doc.page_content for doc in documents)
        self.set_output(content)
        return content