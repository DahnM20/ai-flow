from .processor import Processor

class LLMPromptProcessor(Processor):
    processor_type = "prompt"
    
    def __init__(self, config):
        super().__init__(config)
        self.prompt = config["inputText"]

    def updateContext(self, data):
        pass
    
    def process(self):
        llm = self.input_processor.get_output()
        output = llm(self.prompt)
        self.output = output
        return output
