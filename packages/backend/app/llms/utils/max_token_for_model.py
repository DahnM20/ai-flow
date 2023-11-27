import tiktoken

DEFAULT_MAX_TOKEN = 4097


def max_token_for_model(model_name):
    token_data = {
        # GPT-4 models
        "gpt-4-1106-preview":128000,
        "gpt-4-vision-preview":128000,
        "gpt-4": 8192,
        "gpt-4-0613": 8192,
        "gpt-4-32k": 32768,
        "gpt-4-32k-0613": 32768,
        "gpt-4-0314": 8192,
        "gpt-4-32k-0314": 32768,
        # GPT-3.5 models
        "gpt-3.5-turbo-1106": 16385,
        "gpt-3.5-turbo": 4097,
        "gpt-3.5-turbo-16k": 16385,
        "gpt-3.5-turbo-instruct": 4097,
        "gpt-3.5-turbo-0613": 4097,
        "gpt-3.5-turbo-16k-0613": 16385,
        "gpt-3.5-turbo-0301": 4097,
        # Other GPT-3.5 models
        "text-davinci-003": 4097,
        "text-davinci-002": 4097,
        "code-davinci-002": 8001,
    }

    return token_data.get(model_name, DEFAULT_MAX_TOKEN)


def nb_token_for_input(input, model_name):
    return len(tiktoken.encoding_for_model(model_name).encode(input))
