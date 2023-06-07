from .processor import Processor
import openai 

class GPTNoContextPromptProcessor(Processor):
    processor_type = "gpt-no-context-prompt"
    
    def __init__(self, config):
        super().__init__(config)
            
        self.model = config.get("gptVersion")
        self.prompt = config["inputText"]
        self.api_key = self.get_api_key('session_openai_api_key')
        
    def process(self):
        input_data = self.input_processor.get_output(self.input_key)
        self.init_context(input_data)
        
        # Générer les prompts à partir des messages
        chat_completion = openai.ChatCompletion.create(
            model=self.model, messages=self.messages, api_key=self.api_key,
        )

        assistant_message = chat_completion.choices[0].message
        answer = assistant_message.content
        self.input_processor.updateContext(assistant_message)
        answer = answer.encode("utf-8").decode("utf8")
        
        self.set_output(answer)
        return answer

    def init_context(self, input_data):
        self.messages = [
            {"role": "system", "content": "You're an helpful assistant"},
        ]
        
        self.messages.append({"role": "user", "content": "To awnser my next request, you will use the following data : " + input_data})
        self.messages.append({"role": "assistant", "content": "Very well."})
        
        user_message = {"role": "user", "content": self.prompt}
        self.messages.append(user_message)
        
    def updateContext(self, data):
        pass