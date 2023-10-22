from .gpt_no_context_prompt_processor import GPTNoContextPromptProcessor


class AIActionProcessor(GPTNoContextPromptProcessor):
    processor_type = "ai-action"

    def __init__(self, config, api_context_data):
        super().__init__(config, api_context_data)

    def init_context(self, input_data: str) -> None:
        """
        Initialise the context for the OpenAI Chat model with a standard set of messages.
        Additional user input data can be provided, which will be added to the messages.

        :param input_data: additional information to be used by the assistant.
        """
        self.messages = [
            {
                "role": "system",
                "content": "You are an assistant that provides direct answers to tasks without adding any meta comments or referencing yourself as an AI.",
            },
        ]

        if input_data:
            self.messages.extend(
                [
                    {
                        "role": "user",
                        "content": f"Here's the data you need: {input_data}. Use it to provide a direct answer to my next request.",
                    },
                    {"role": "assistant", "content": "Very well."},
                ]
            )

        self.messages.append({"role": "user", "content": self.prompt})
