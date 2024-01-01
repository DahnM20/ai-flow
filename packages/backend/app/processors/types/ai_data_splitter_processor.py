from ..context.processor_context import ProcessorContext
from .processor import APIContextProcessor
from ...llms.factory.llm_factory import LLMFactory
from ...root_injector import root_injector

from llama_index.llms.base import ChatMessage

from .processor_type_name_utils import ProcessorType


class AIDataSplitterProcessor(APIContextProcessor):
    processor_type = ProcessorType.AI_DATA_SPLITTER
    SPLIT_CHAR = ";"

    def __init__(
        self, config, api_context_data: ProcessorContext, custom_llm_factory=None
    ):
        super().__init__(config, api_context_data)

        self.nb_output = 0
        self.model = "gpt-4-1106-preview"
        self.api_key = api_context_data.get_api_key_for_model(self.model)

        if custom_llm_factory is None:
            custom_llm_factory = self._get_default_llm_factory()

        self.llm_factory = custom_llm_factory

    @staticmethod
    def _get_default_llm_factory():
        return root_injector.get(LLMFactory)

    def process(self):
        if self.get_input_processor() is None:
            return None

        input_data = self.get_input_processor().get_output(
            self.get_input_node_output_key()
        )

        self.init_context(input_data)

        llm = self.llm_factory.create_llm(self.model, api_key=self.api_key)
        chat_response = llm.chat(self.messages)
        answer = chat_response.message.content

        data_to_split = answer.encode("utf-8").decode("utf8")
        self.set_output(data_to_split.split(AIDataSplitterProcessor.SPLIT_CHAR))
        self.nb_output = len(self._output)

        return self._output

    def init_context(self, input_data: str) -> None:
        """
        Initialise the context for the OpenAI Chat model with a standard set of messages.
        Additional user input data can be provided, which will be added to the messages.

        :param input_data: additional information to be used by the assistant.
        """
        system_msg = (
            "You are an assistant that provides direct answers to tasks without adding any meta comments or referencing yourself as an AI. "
            "Your only task is to logically separate with a semicolon (;) ideas or concepts."
            "To help you, here's a list of examples : "
            """
1st example:

Input: "The main idea is that dogs are very popular pets, and many people enjoy walking them in parks. Another important concept is that dogs need a lot of exercise to stay healthy."
Output: Dogs are very popular pets;many people enjoy walking them in parks;dogs need a lot of exercise to stay healthy.")

2nd example:

Input:"1) A picture of a woman 2) A video with a bird 3) Air conditioner"
Output: A picture of a woman;A video with a bird;Air conditioner

3rd example:

Input:"Here are two ideas : 
- Dogs are better than cats
- Birds are beautiful"

Output: Dogs are better than cats;Birds are beautiful

4th example: 
"Crée une interprétation artistique numérique de la ville de New York la nuit sous la pluie, mettant l'accent sur les reflets lumineux sur les surfaces mouillées."
"Imagine et dessine un nouveau type de fleur qui n'existe pas encore dans la nature. Assure-toi qu'elle a une allure exotique et utilise des couleurs vives et uniques que l'on ne trouve pas couramment chez les fleurs."
"Conçois une image représentant une scène du futur, avec des villes futuristes, des technologies avancées et des formes de vie artificielles coexistant avec des formes de vie naturelles."

Output: Crée une interprétation artistique numérique de la ville de New York la nuit sous la pluie, mettant l'accent sur les reflets lumineux sur les surfaces mouillées.;Imagine et dessine un nouveau type de fleur qui n'existe pas encore dans la nature. Assure-toi qu'elle a une allure exotique et utilise des couleurs vives et uniques que l'on ne trouve pas couramment chez les fleurs.;Conçois une image représentant une scène du futur, avec des villes futuristes, des technologies avancées et des formes de vie artificielles coexistant avec des formes de vie naturelles.

Now, be ready to do it with my next message
"""
        )

        self.messages = [
            ChatMessage(role="system", content=system_msg),
            ChatMessage(role="user", content=input_data),
        ]

    def cancel(self):
        pass

    def update_context(self, data):
        pass
