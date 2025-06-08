import logging
from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor


from .processor_type_name_utils import ProcessorType
from openai import OpenAI


def interpret_escape_sequences(separator):
    escape_dict = {
        r"\n": "\n",
        r"\r": "\r",
        r"\t": "\t",
    }
    return escape_dict.get(separator, separator)


class AIDataSplitterProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.AI_DATA_SPLITTER
    DEFAULT_SEPARATOR = ";"
    AI_MODE = "ai"
    MANUAL_MODE = "manual"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

        self.nb_output = 0
        self.model = "gpt-4o"
        self.api_key = context.get_value("openai_api_key")

    def get_llm_response(self, messages):
        client = OpenAI(api_key=self.api_key)

        kwargs = {"model": self.model, "input": messages}
        response = client.responses.create(**kwargs)
        return response.output_text

    def process(self):
        if self.get_input_processor() is None:
            return ""

        input_data = self.get_input_processor().get_output(
            self.get_input_node_output_key()
        )

        mode = self.get_input_by_name("mode", self.AI_MODE)

        if mode == self.AI_MODE:
            self.init_context(input_data)

            answer = self.get_llm_response(self.messages)

            data_to_split = answer.encode("utf-8").decode("utf8")
            self.set_output(
                data_to_split.split(AIDataSplitterProcessor.DEFAULT_SEPARATOR)
            )
            self.nb_output = len(self._output)

        if mode == self.MANUAL_MODE:
            separator = self.get_input_by_name(
                "separator", AIDataSplitterProcessor.DEFAULT_SEPARATOR
            )
            separator = interpret_escape_sequences(separator)
            self.set_output(input_data.split(separator))
            self.nb_output = len(self._output)

        return self._output

    def init_context(self, input_data: str) -> None:
        """
        Initialize the context for the OpenAI Chat model with a set of standard messages.
        Additional user input data can be provided, which will be added to the messages.

        :param input_data: Additional information or text provided by the user that needs processing.
        """
        # Define the system message with clear instructions and examples
        system_msg = (
            "You are an assistant whose task is to separate ideas or concepts from the input text using semicolons (;). "
            "Do not include any meta-comments or self-references in your responses. "
            "Here are some examples of how to perform the task: "
            "\n\n"
            "Example 1:\n"
            "Input: 'The main idea is that dogs are very popular pets, and many people enjoy walking them in parks. Another important concept is that dogs need a lot of exercise to stay healthy.'\n"
            "Output: 'Dogs are very popular pets; many people enjoy walking them in parks; dogs need a lot of exercise to stay healthy.'\n\n"
            "Example 2:\n"
            "Input: '1) A picture of a woman 2) A video with a bird 3) Air conditioner'\n"
            "Output: 'A picture of a woman; A video with a bird; Air conditioner.'\n\n"
            "Example 3:\n"
            "Input: 'Here are two ideas: - Dogs are better than cats - Birds are beautiful'\n"
            "Output: 'Dogs are better than cats; Birds are beautiful.'\n\n"
            "Example 4:\n"
            "Input: 'Crée une interprétation artistique numérique de la ville de New York la nuit sous la pluie, mettant l'accent sur les reflets lumineux sur les surfaces mouillées. Imagine et dessine un nouveau type de fleur qui n'existe pas encore dans la nature. Assure-toi qu'elle a une allure exotique et utilise des couleurs vives et uniques que l'on ne trouve pas couramment chez les fleurs. Conçois une image représentant une scène du futur, avec des villes futuristes, des technologies avancées et des formes de vie artificielles coexistant avec des formes de vie naturelles.'\n"
            "Output: 'Crée une interprétation artistique numérique de la ville de New York la nuit sous la pluie, mettant l'accent sur les reflets lumineux sur les surfaces mouillées; Imagine et dessine un nouveau type de fleur qui n'existe pas encore dans la nature. Assure-toi qu'elle a une allure exotique et utilise des couleurs vives et uniques que l'on ne trouve pas couramment chez les fleurs; Conçois une image représentant une scène du futur, avec des villes futuristes, des technologies avancées et des formes de vie artificielles coexistant avec des formes de vie naturelles.'\n\n"
            "After reading the input, output each distinct idea or concept separated by semicolons."
        )

        user_nb_output = self.get_input_by_name("nb_output", 0)
        if user_nb_output > 1:
            system_msg += f"\nThe estimated number of outputs for the next message is {user_nb_output}."

        self.messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": input_data},
        ]

    def cancel(self):
        pass
