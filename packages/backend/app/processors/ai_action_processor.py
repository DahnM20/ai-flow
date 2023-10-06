from .gpt_no_context_prompt_processor import GPTNoContextPromptProcessor


class AIActionProcessor(GPTNoContextPromptProcessor):
    processor_type = "ai-action"

    def __init__(self, config, api_context_data):
        super().__init__(config, api_context_data)
