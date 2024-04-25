import os
from json import dumps, loads
from typing import Any, List, Sequence
from urllib.parse import urlparse

import openai
import pymongo
from dotenv import load_dotenv
from llama_index.core.llms import (
    CustomLLM,
    CompletionResponse,
    CompletionResponseGen,
    LLMMetadata,
)
from llama_index.core import Settings
from llama_index.core.llms.callbacks import llm_completion_callback
from pydantic import BaseModel

# local imports
from engine.llms import llm_mistral_ai_inference_api


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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


def load_llm(model_name: str):
    pass


class OurLLM(CustomLLM):
    context_window: int = 3900
    num_output: int = 256
    model_name: str = "mistralai/Mixtral-8x7B-Instruct-v0.1"
    dummy_response: str = "dummy response"

    @property
    def metadata(self) -> LLMMetadata:
        """Get LLM metadata."""
        return LLMMetadata(
            context_window=CONTEXT_WINDOW,
            num_output=NUM_OUTPUT,
            model_name=self.model_name,
        )

    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        return CompletionResponse(text=self.dummy_response)

    @llm_completion_callback()
    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponseGen:
        response = ""
        for token in self.dummy_response:
            response += token
            yield CompletionResponse(text=response, delta=token)


class WebChat(BaseModel):

    # def set_doc_store(self, urls: List[str]) -> None:
    #     """
    #     This method takes in a list of urls and call the llama index
    #     data loader method SimpleWebPageReader that scrapes contents
    #     from the websites and loads the data.
    #     """
    #     try:
    #         db_name = create_db_name(urls[0])
    #         # create (or load) docstore and add nodes
    #         self.doc_store = MongoDocumentStore.from_uri(uri=MONGO_URI, db_name=db_name)

    #         self.index_store = MongoIndexStore.from_uri(uri=MONGO_URI, db_name=db_name)

    #         documents = SimpleWebPageReader(html_to_text=True).load_data(urls=urls)

    #         # self.vec_store = MongoDBAtlasVectorSearch(
    #         #     mongodb_client=mongodb_client, db_name=db_name
    #         # )

    #         # create parser and parse document into nodes
    #         parser = SimpleNodeParser.from_defaults()
    #         nodes = parser.get_nodes_from_documents(documents)
    #         self.doc_store.add_documents(nodes)

    #         self.nodes = nodes
    #     except Exception as e:
    #         print(f"Error setting document store: {e}")
    #         raise e

    def get_response(self, query_str: str) -> str:
        try:
            print("query_str: ", query_str)
            # query_engine = self.vec_index.as_query_engine(verbose=True)
            # response = query_engine.query(query_str)
            response = llm_mistral_ai_inference_api.complete(prompt=query_str)
            print("bot response: ", response)
            return str(response)
        except Exception as e:
            print(f"Error getting bot response: {e}")
            raise e
