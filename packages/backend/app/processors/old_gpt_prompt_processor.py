from .processor import Processor

import openai
class OldGPTPromptProcessor(Processor):
    processor_type = "gpt-prompt"
    
    def __init__(self, config):
        super().__init__(config)
        self.prompt = config["inputText"]
    
    def updateContext(self, data):
        pass

    def process(self):
        init_context = self.input_processor.get_output()
        user_message = {"role": "user", "content": self.prompt}
        print('init_context    ' + str(init_context))
        init_context.append(user_message)
        self.input_processor.updateContext(user_message)

        # Générer les prompts à partir des messages
        chat_completion = openai.ChatCompletion.create(
            model=self.input_processor.model, messages=init_context
        )

        assistant_message = chat_completion.choices[0].message
        answer = assistant_message.content
        self.input_processor.updateContext(assistant_message)
        answer = answer.encode("utf-8").decode("utf8")

        # On supprime notre message pour garder le contexte neutre
        init_context.pop()
        self.set_output(answer)
        return answer