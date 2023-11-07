import os
from json import dumps, loads
from typing import Any, List, Sequence
from urllib.parse import urlparse

import openai
import pymongo
from dotenv import load_dotenv
from llama_index import (
    Document,
    LLMPredictor,
    PromptHelper,
    ServiceContext,
    SimpleWebPageReader,
    StorageContext,
    VectorStoreIndex,
)
from llama_index.llms import HuggingFaceLLM, OpenAI
from llama_index.llms.base import CompletionResponse, LLMMetadata
from llama_index.llms.custom import CustomLLM
from llama_index.memory import ChatMemoryBuffer
from llama_index.node_parser import SimpleNodeParser
from llama_index.storage.docstore import MongoDocumentStore
from llama_index.storage.index_store import MongoIndexStore
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI") or ""
mongodb_client = pymongo.MongoClient(MONGO_URI)

# define prompt helper
# set maximum input size
CONTEXT_WINDOW = 2048
# set number of output tokens
NUM_OUTPUT = 525
# set maximum chunk overlap
CHUNK_OVERLAP_RATION = 0.2


def create_db_name(url: str) -> str:
    # Parse the URL
    parsed_url = urlparse(url)

    # Use the netloc and path to create a unique name
    db_name = f"{parsed_url.netloc}{parsed_url.path}".replace(".", "_").replace(
        "/", "_"
    )

    return db_name


def load_model(model_name: str):
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name, config="T5Config")

        pipe = pipeline(
            task="text-generation",
            model=model,
            tokenizer=tokenizer,
            # device=0, # GPU device number
            # max_length=512,
            do_sample=True,
            top_p=0.95,
            top_k=50,
            temperature=0.7,
        )

        return pipe
    except Exception as e:
        print(f"Error loading model: {e}")
        raise e


class OurLLM(CustomLLM):
    model_name = ""
    pipeline = Any
    # def __init__(self, model_name: str, model_pipeline):
    #     self.model_name = model_name
    #     self.pipeline = model_pipeline

    @property
    def metadata(self) -> LLMMetadata:
        """Get LLM metadata."""
        return LLMMetadata(
            context_window=CONTEXT_WINDOW,
            num_output=NUM_OUTPUT,
            model_name=self.model_name,
        )

    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        try:
            prompt_length = len(prompt)
            response = self.pipeline(prompt, max_new_tokens=NUM_OUTPUT)[0][
                "generated_text"
            ]

            # only return newly generated tokens
            text = response[prompt_length:]
            return CompletionResponse(text=text)
        except Exception as e:
            print(f"Error in completion: {e}")
            raise e

    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        raise NotImplementedError()


class WebChatModel:
    model_name = ""
    pipe = Any

    def __init__(self) -> None:
        self.doc_store = MongoDocumentStore(mongo_kvstore=Any)
        self.index_store = MongoIndexStore(mongo_kvstore=Any)
        # self.documents = Any
        # self.vec_store = MongoDBAtlasVectorSearch()
        self.nodes = None
        self.vec_index = VectorStoreIndex(nodes=[])
        self.prompt_helper = PromptHelper(
            context_window=CONTEXT_WINDOW,
            num_output=NUM_OUTPUT,
            chunk_overlap_ratio=CHUNK_OVERLAP_RATION,
        )

    def set_doc_store(self, urls: List[str]) -> None:
        """
        This method takes in a list of urls and call the llama index
        data loader method SimpleWebPageReader that scrapes contents
        from the websites and loads the data.
        """
        try:
            db_name = create_db_name(urls[0])
            # create (or load) docstore and add nodes
            self.doc_store = MongoDocumentStore.from_uri(uri=MONGO_URI, db_name=db_name)

            self.index_store = MongoIndexStore.from_uri(uri=MONGO_URI, db_name=db_name)

            documents = SimpleWebPageReader(html_to_text=True).load_data(urls=urls)

            # self.vec_store = MongoDBAtlasVectorSearch(
            #     mongodb_client=mongodb_client, db_name=db_name
            # )

            # create parser and parse document into nodes
            parser = SimpleNodeParser.from_defaults()
            nodes = parser.get_nodes_from_documents(documents)
            self.doc_store.add_documents(nodes)

            self.nodes = nodes
        except Exception as e:
            print(f"Error setting document store: {e}")
            raise e

    def add_nodes_to_doc(self):
        return

    def set_vector_index(self, model_name: str) -> None:
        try:
            print(f"creating a new index {model_name}... ")

            # define llm
            self.model_name = model_name
            # self.pipe = load_model(model_name=model_name)
            # llm = self.OurLLM()
            # llm.model_name = model_name
            # llm.pipeline = pipe
            # for now, don't use custome OurLLM model yet, need to improve
            llm = OpenAI(temperature=0.1, model=model_name, max_tokens=NUM_OUTPUT)

            llm_predictor = LLMPredictor(llm=llm)
            service_context = ServiceContext.from_defaults(
                llm_predictor=llm_predictor, prompt_helper=self.prompt_helper
            )

            # create storage context
            storage_context = StorageContext.from_defaults(
                docstore=self.doc_store, index_store=self.index_store
            )

            # build index
            self.vec_index = VectorStoreIndex(
                use_async=True,
                nodes=self.nodes,
                service_context=service_context,
                storage_context=storage_context,
                show_progress=True,
            )

            # later store our vector index in pinecone vector store
        except Exception as e:
            print(f"Error setting vector index: {e}")
            raise e

    def get_vector_index(self) -> VectorStoreIndex:
        # for now, return this, but later, we use model_name to retrieve our index from pinecone
        return self.vec_index

    def get_response(self, query_str: str) -> str:
        try:
            print("query_str: ", query_str)
            query_engine = self.vec_index.as_query_engine(verbose=True)
            response = query_engine.query(query_str)
            print("bot response: ", response)
            return str(response)
        except Exception as e:
            print(f"Error getting bot response: {e}")
            raise e
