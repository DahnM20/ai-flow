from .processor import APIContextProcessor
import openai


class GPTNoContextPromptProcessor(APIContextProcessor):
    processor_type = "gpt-no-context-prompt"
    DEFAULT_MODEL = "gpt-4"

    def __init__(self, config, api_context_data):
        super().__init__(config, api_context_data)

        self.model = config.get("gptVersion", GPTNoContextPromptProcessor.DEFAULT_MODEL)
        self.prompt = config["inputText"]
        self.api_key = self.get_api_key("session_openai_api_key")

    def process(self):
        input_data = None
        if self.get_input_processor() is not None:
            input_data = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )

        self.init_context(input_data)

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
