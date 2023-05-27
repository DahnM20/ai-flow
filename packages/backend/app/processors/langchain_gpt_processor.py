from .processor import Processor

class LLMProcessor(Processor):
    processor_type = "llm"
    
    def __init__(self, config):
        super().__init__(config)
        self.init_data = config["initData"]
        self.llm = OpenAI(temperature=0.9, openai_api_key=os.getenv("OPEN_AI_KEY"))

    def updateContext(self, data):
        pass
    
    def process(self):
        self.output = self.llm
        return self.llm
