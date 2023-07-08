from .processor import Processor


class OldGPTProcessor(Processor):
    processor_type = "gpt"

    def __init__(self, config):
        super().__init__(config)
        self.init_data = config.get("initData") if config.get("initData") else ""

        self.model = config.get("gptVersion")
        self.messages = [
            {"role": "system", "content": self.init_data},
        ]

    def createInitialContent(self):
        if hasattr(self, "input_processor") and self.input_processor is not None:
            input_processor_output = self.input_processor.get_output(self.input_key)
            
            contextSuffix = (
                " To answer my next request, you will use the following data : "
                + input_processor_output
                if input_processor_output
                else ""
            )
        else:
            contextSuffix = ""

        return self.init_data + contextSuffix

    def updateContext(self, data):
        self.messages.append(data)

    def process(self):
        self.messages.append(
            {
                "role": "user",
                "content": self.createInitialContent(),
            }
        )
        self.messages.append({"role": "assistant", "content": "Very well."})
        self.set_output(self.messages)
        return self.messages
