import logging

from ...launcher.processor_event import ProcessorEvent
from ...launcher.event_type import EventType
from ....llms.utils.max_token_for_model import max_token_for_model, nb_token_for_input
from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor
from openai import OpenAI

from .processor_type_name_utils import ProcessorType


class LLMPromptProcessor(ContextAwareProcessor):
    processor_type = ProcessorType.LLM_PROMPT
    DEFAULT_MODEL = "gpt-4o"
    streaming = True
    models_with_web_search = [
        "gpt-4o",
        "gpt-4o-mini",
        "gpt-4.1",
        "gpt-4.1-mini",
    ]

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

        self.model = config.get("model", LLMPromptProcessor.DEFAULT_MODEL)
        self.prompt = config.get("prompt", None)

    def handle_stream_answer(self, awnser):
        event = ProcessorEvent(self, awnser)
        self.notify(EventType.STREAMING, event)

    def nb_tokens_from_messages(self, messages, model):
        """
        Calculates the total number of tokens in a list of messages using nb_token_for_input.
        """
        total_tokens = 0
        token_overhead = 3
        for message in messages:
            content_tokens = nb_token_for_input(message["content"], model)
            total_tokens += content_tokens + token_overhead
        total_tokens += token_overhead
        return total_tokens

    def check_for_html_tags(self, text):
        """
        Checks if the given text contains HTML tags or attributes.
        """
        if "<html" in text or "<body" in text:
            return True
        return False

    def process(self):
        api_key = self._processor_context.get_value("openai_api_key")

        search_enabled = False
        if self.model in self.models_with_web_search:
            search_enabled = self.get_input_by_name("web_search", False)
            search_context_size = self.get_input_by_name("search_context_size", None)

        if api_key is None:
            raise Exception("No OpenAI API key found")

        af_node_version = self.get_input_by_name("af_node_version", 1)

        context = None
        if af_node_version > 1:
            context = self.get_input_by_name("context", None)
            self.prompt = self.get_input_by_name("prompt", None)
        else:
            if self.get_input_processor() is not None:
                context = self.get_input_processor().get_output(
                    self.get_input_node_output_key()
                )

        if self.prompt is None:
            raise Exception("No prompt provided")

        self.init_context(context)
        total_tokens = self.nb_tokens_from_messages(self.messages, self.model)
        model_max_tokens = max_token_for_model(self.model)

        if total_tokens > model_max_tokens:
            logging.warning("Messages size: " + str(total_tokens))
            logging.warning("Model capacity: " + str(model_max_tokens))
            message = (
                "The text size exceeds the model's capacity. "
                "Consider using a model with greater context handling capabilities or utilize the 'Find Similar Text' node to create a cohesive, condensed version of the context."
            )
            if (
                context and self.check_for_html_tags(context)
            ) or self.check_for_html_tags(self.prompt):
                message += (
                    "\n\n"
                    "Note: HTML tags or attributes are detected within the data provided. If they are unnecessary for this task, removing them could significantly reduce the context size."
                )
            raise Exception(message)

        client = OpenAI(api_key=api_key)

        kwargs = {"model": self.model, "input": self.messages, "stream": self.streaming}

        if search_enabled:
            kwargs["tools"] = [
                {
                    "type": "web_search_preview",
                    "search_context_size": search_context_size,
                }
            ]

        stream = client.responses.create(**kwargs)

        final_response = ""

        for event in stream:
            type = event.type
            if type == "response.output_text.delta":
                final_response += event.delta
                self.handle_stream_answer(final_response)
            if type == "response.completed":
                response_data = event.response
                final_response = response_data.output_text
            if type == "response.failed":
                response_data = event.response
                if not hasattr(response_data, "error"):
                    logging.warning(f"Error from OpenAI with no data: {response_data}")
                    continue

                raise LightException(
                    f"Error from OpenAI : {response_data.error.message}"
                )
            if type == "error":
                raise LightException(f"Error from OpenAI : {event.message}")

        return final_response

    def init_context(self, context: str) -> None:
        """
        Initialise the context for the LLM model with a standard set of messages.
        Additional user input data can be provided, which will be added to the messages.

        :param context: additional information to be used by the assistant.
        """
        if context is None:
            system_msg = "You are a helpful assistant. "
            user_msg_content = self.prompt
        else:
            system_msg = (
                "You are a helpful assistant. "
                "You will respond to requests indicated by the '#Request' tag, "
                "using the context provided under the '#Context' tag."
                "Your response should feel natural and seamless, as if you've internalized the context "
                "and are answering the request without needing to directly point back to the information provided"
            )
            user_msg_content = f"#Context: {context} \n\n#Request: {self.prompt}"

        self.messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg_content},
        ]

    def cancel(self):
        pass
