from .processor import APIContextProcessor
import openai
import re


from enum import Enum


class MergeModeEnum(Enum):
    MERGE = 1
    MERGE_AND_PROMPT = 2


class MergeProcessor(APIContextProcessor):
    processor_type = "merger-prompt"
    DEFAULT_MODEL = "gpt-4"

    def __init__(self, config, api_context_data):
        super().__init__(config, api_context_data)

        self.model = config.get("gptVersion", MergeProcessor.DEFAULT_MODEL)
        self.prompt = config["inputText"]
        self.merge_mode = MergeModeEnum(int(config["mergeMode"]))
        self.api_key = self.get_api_key("session_openai_api_key")

    def update_prompt(self, inputs):
        for idx, value in enumerate(inputs, start=1):
            placeholder = f"${{input-{idx}}}"
            self.prompt = re.sub(re.escape(placeholder), value, self.prompt)

    def process(self):
        inputs_processor = self.get_input_processors()
        inputs_output_keys = self.get_input_node_output_keys()
        inputs = [
            processor.get_output(output_key)
            for processor, output_key in zip(inputs_processor, inputs_output_keys)
        ]

        self.update_prompt(inputs)

        if self.merge_mode == MergeModeEnum.MERGE:
            self.set_output(self.prompt)
            return self.prompt

        self.init_context()
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

    def init_context(self) -> None:
        self.messages = [
            {
                "role": "system",
                "content": "You are an assistant that provides direct answers to tasks without adding any meta comments or referencing yourself as an AI.",
            },
        ]
        self.messages.append({"role": "user", "content": self.prompt})

    def updateContext(self, data):
        pass
