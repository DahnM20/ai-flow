from .processor import Processor
import openai


class GPTNoContextPromptProcessor(Processor):
    processor_type = "gpt-no-context-prompt"

    def __init__(self, config):
        super().__init__(config)

        self.model = config.get("gptVersion")
        self.prompt = config["inputText"]
        self.api_key = self.get_api_key("session_openai_api_key")

    def process(self):
        input_data = None
        if getattr(self, 'input_processor', None) is not None:
            input_data = self.input_processor.get_output(self.input_key)

        self.init_context(input_data)

        # Générer les prompts à partir des messages
        chat_completion = openai.ChatCompletion.create(
            model=self.model,
            messages=self.messages,
            api_key=self.api_key,
        )

        assistant_message = chat_completion.choices[0].message
        answer = assistant_message.content
        answer = answer.encode("utf-8").decode("utf8")

        self.set_output(answer)
        return answer

    def init_context(self, input_data: str) -> None:
        """
        Initialise the context for the OpenAI Chat model with a standard set of messages.
        Additional user input data can be provided, which will be added to the messages.

        :param input_data: additional information to be used by the assistant.
        """
        self.messages = [
            {"role": "system", "content": "You're an helpful assistant"},
        ]

        if input_data:
            self.messages.extend(
                [
                    {
                        "role": "user",
                        "content": f"To answer my next request, you will use the following data : {input_data}",
                    },
                    {"role": "assistant", "content": "Very well."},
                ]
            )

        self.messages.append({"role": "user", "content": self.prompt})

    def updateContext(self, data):
        pass
