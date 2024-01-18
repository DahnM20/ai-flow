import logging
import tiktoken
from llama_index import Document, OpenAIEmbedding, ServiceContext, VectorStoreIndex
from llama_index.text_splitter.token_splitter import TokenTextSplitter
from llama_index.indices.postprocessor import SentenceEmbeddingOptimizer
from llama_index.indices.postprocessor import LongContextReorder
from llama_index.indices.postprocessor import SimilarityPostprocessor

from llama_index.node_parser import SimpleNodeParser

from ...root_injector import root_injector
from ..factory.llm_factory import LLMFactory
from .prompt_engine import PromptEngine

from collections import OrderedDict


class VectorIndexPromptEngine(PromptEngine):
    MAX_CACHE_SIZE = 10
    TOKEN_CHUNK_SIZE = 256
    TOKEN_CHUNK_OVERLAP = 20

    VECTOR_STORE_CACHE = OrderedDict()

    @staticmethod
    def _get_default_llm_factory():
        return root_injector.get(LLMFactory)

    @staticmethod
    def _hash_init_data(init_data):
        import hashlib

        return hashlib.sha256(init_data.encode()).hexdigest()

    def __init__(self, model, api_key, init_data, custom_llm_factory=None):
        init_data_hash = self._hash_init_data(init_data)
        self.init_data = init_data
        self.model = model

        if custom_llm_factory is None:
            custom_llm_factory = self._get_default_llm_factory()

        self.llm_factory = custom_llm_factory
        self.api_key = api_key

        llm = self.llm_factory.create_llm(model=self.model, api_key=self.api_key)
        self.embed_model = OpenAIEmbedding(embed_batch_size=10, api_key=self.api_key)

        self.service_context = ServiceContext.from_defaults(
            llm=llm, embed_model=self.embed_model
        )

        self.index = self._get_from_cache_or_initialize(init_data_hash)

    def _get_from_cache_or_initialize(self, init_data_hash):
        if init_data_hash in VectorIndexPromptEngine.VECTOR_STORE_CACHE:
            logging.debug("Cache Hit")
            VectorIndexPromptEngine.VECTOR_STORE_CACHE.move_to_end(init_data_hash)
            return VectorIndexPromptEngine.VECTOR_STORE_CACHE[init_data_hash]

        logging.debug("Cache Miss")
        index = self._initialize_vector_store()

        if (
            len(VectorIndexPromptEngine.VECTOR_STORE_CACHE)
            >= VectorIndexPromptEngine.MAX_CACHE_SIZE
        ):
            VectorIndexPromptEngine.VECTOR_STORE_CACHE.popitem(last=False)

        VectorIndexPromptEngine.VECTOR_STORE_CACHE[init_data_hash] = index

        return index

    def _initialize_vector_store(self):
        documents = [Document(text=self.init_data)]

        text_splitter = TokenTextSplitter(
            separator=" ",
            chunk_size=VectorIndexPromptEngine.TOKEN_CHUNK_SIZE,
            chunk_overlap=VectorIndexPromptEngine.TOKEN_CHUNK_OVERLAP,
            backup_separators=["\n"],
            tokenizer=tiktoken.encoding_for_model(self.model).encode,
        )

        parser = SimpleNodeParser.from_defaults(text_splitter=text_splitter)
        nodes = parser.get_nodes_from_documents(documents)

        index = VectorStoreIndex(
            nodes, show_progress=True, service_context=self.service_context
        )

        return index

    def prompt(self, messages):
        chat_engine = self.index.as_query_engine(
            service_context=self.service_context,
            node_post_processors=[
                SentenceEmbeddingOptimizer(
                    embed_model=self.embed_model,
                    percentile_cutoff=0.5,
                    # threshold_cutoff=0.7
                ),
                LongContextReorder(),
                SimilarityPostprocessor(similarity_cutoff=0.7),
            ],
        )

        chat_response = chat_engine.query(messages)
        # print("Nodes : ", chat_response.source_nodes)
        return chat_response.response

    def prompt_stream(self, messages):
        pass
