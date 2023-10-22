from .processor import APIContextProcessor
import openai


class AIDataSplitterProcessor(APIContextProcessor):
    processor_type = "ai-data-splitter"
    SPLIT_CHAR = ";"

    def __init__(self, config, api_context_data):
        super().__init__(config, api_context_data)

        self.nb_output = 0
        self.model = "gpt-4"
        self.api_key = self.get_api_key("session_openai_api_key")

    def process(self):
        if getattr(self, "input_processor", None) is None:
            return None

        input_data = self.input_processor.get_output(self.input_key)

        self.init_context(input_data)

        chat_completion = openai.ChatCompletion.create(
            model=self.model,
            messages=self.messages,
            api_key=self.api_key,
        )

        assistant_message = chat_completion.choices[0].message
        answer = assistant_message.content
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
        self.messages = [
            {"role": "system", "content": "You're an helpful assistant"},
        ]

        if input_data:
            self.messages.extend(
                [
                    {
                        "role": "user",
                        "content": """I'm going to give you a list of ideas and concepts that might be presented in different ways. Your task is to logically separate them with a semicolon (;), remove any unnecessary elements, and only give the essential ideas or concepts.

1st example:

Input: "The main idea is that dogs are very popular pets, and many people enjoy walking them in parks. Another important concept is that dogs need a lot of exercise to stay healthy."
Output: Dogs are very popular pets;many people enjoy walking them in parks;dogs need a lot of exercise to stay healthy.

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

Now, be ready to do it with my next message""",
                    },
                    {"role": "assistant", "content": "Very well."},
                ]
            )

        self.messages.append({"role": "user", "content": input_data})

    def updateContext(self, data):
        pass
