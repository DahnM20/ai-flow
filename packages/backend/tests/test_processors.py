import unittest
from processor_launcher import InputProcessor, LLMProcessor, LLMPromptProcessor, ProcessorFactory

class TestProcessors(unittest.TestCase):

    def test_input_processor(self):
        config = {
            "name": "1svsto5z9#input",
            "processor_type": "input",
            "input": "",
            "inputText": "Ceci est la transcription d'une vidéo Youtube",
            "x": -1285.6483752801057,
            "y": -1343.1688861784348
        }
        processor = InputProcessor(config)
        # Testez les attributs de l'objet
        self.assertEqual(processor.name, "1svsto5z9#input")
        # Testez la méthode process()
        # self.assertEqual(processor.process(), expected_result)

    def test_llm_processor(self):
        # À compléter de manière similaire à test_input_processor()
        pass

    def test_prompt_processor(self):
        # À compléter de manière similaire à test_input_processor()
        pass

    def test_processor_factory(self):
        factory = ProcessorFactory()
        factory.register_processor("input", InputProcessor)
        factory.register_processor("llm", LLMProcessor)
        factory.register_processor("prompt", LLMPromptProcessor)
        # Testez la méthode create_processor()
        # À compléter

# Pour exécuter les tests
if __name__ == "__main__":
    unittest.main()