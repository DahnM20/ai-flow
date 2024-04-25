from ..model import Field, NodeConfig
from .extension_base_processor import SimpleExtensionProcessor
from langchain.document_loaders import OnlinePDFLoader


class PDFToText(SimpleExtensionProcessor):
    processor_type = "pdf-to-text-processor"

    def __init__(self, config):
        super().__init__(config)

    def get_schema(self):
        urlInput = Field(
            name="url",
            label="url",
            type="input",
            required=True,
            placeholder="URLPlaceholder",
            hasHandle=True,
        )

        fields = [urlInput]

        config = NodeConfig(
            nodeName="PDFToText",
            processorType=self.processor_type,
            icon="FaFile",
            fields=fields,
            outputType="text",
            section="tools",
            helpMessage="urlInputHelp",
            hasInputHandle=True,
            showHandlesNames=True,
        )

        return config

    def process(self):
        url = self.get_input_by_name("url")
        loader = OnlinePDFLoader(file_path=url)
        try:
            document = loader.load()
            if len(document) > 0:
                output = document[0].page_content
                return output
            else:
                return None
        except Exception as e:
            print(f"Failed to load PDF from URL: {e}")
            return None
