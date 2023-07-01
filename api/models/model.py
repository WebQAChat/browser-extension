import os
from json import dumps, loads

import openai
from dotenv import load_dotenv
from langchain.llms import OpenAI
from llama_index import (
    GPTVectorStoreIndex,
    ServiceContext,
    SimpleWebPageReader,
    StorageContext,
    load_index_from_storage,
)

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def prepare_data(urls):
    """
    This method takes in a list of urls and call the llama index
    data loader method SimpleWebPageReader that scrapes contents
    from the websites and loads the data.
    """
    return SimpleWebPageReader(html_to_text=True).load_data(urls=urls)


# we are using openai gpt-4 model
def initialize_index(index_name):
    file_path = f"./api/vectorStores/{index_name}"
    if os.path.exists(file_path):
        # rebuild storage context
        storage_context = StorageContext.from_defaults(persist_dir=file_path)

        # local load index access
        index = load_index_from_storage(storage_context)

        return index
    else:
        # we need to somehow extract the url of the website the user is visiting.
        # for testing purpose,
        urls = ["https://cs186berkeley.net/resources/"]
        documents = prepare_data(urls)

        # define llm
        service_context = ServiceContext.from_defaults(
            llm=OpenAI(
                client="",
                model="gpt-4",
                max_tokens=512,
                openai_api_key=os.getenv("OPENAI_API_KEY"),
            )
        )

        # create a vector store index
        index = GPTVectorStoreIndex.from_documents(
            documents, service_context=service_context
        )

        # store the index file locally
        index.storage_context.persist(file_path)
        return index


class WebChatModel:
    def __init__(self, index_name) -> None:
        self.vec_index = initialize_index(index_name)

    def get_response(self, query_str):
        print("query_str: ", query_str)
        query_engine = self.vec_index.as_query_engine()
        response = query_engine.query(query_str)
        return response

    # will use this instance method when
    # we know how to get the url of the website that
    # the user is visiting.
    def prepare_data(self, urls):
        """
        This method takes in a list of urls and call the llama index
        data loader method SimpleWebPageReader that scrapes contents
        from the websites and loads the data.
        """
        return SimpleWebPageReader(html_to_text=True).load_data(urls=urls)
