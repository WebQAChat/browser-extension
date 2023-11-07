from typing import List, Optional

import uvicorn
from fastapi import APIRouter, FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from models import model


class Tab(BaseModel):
    tabId: str
    urls: List[str]


class ChatbotType(BaseModel):
    modelName: str


app = FastAPI()
api_router = APIRouter()

chatModel = model.WebChatModel()


@app.post("/api/tab/extract")
def extract_data_from_urls(tab: Tab):
    try:
        print(tab)
        chatModel.set_doc_store(urls=tab.urls)

        return JSONResponse(
            content={"message": "Extracted data successfully", "data": {}},
            media_type="application/json",
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        return JSONResponse(
            content=str(e),
            media_type="application/json",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


@app.post("/api/model/init")
def init_chatbot(type: ChatbotType):
    try:
        print("chatbot type: ", type.modelName)
        chatModel.set_vector_index(model_name=type.modelName)

        return JSONResponse(
            content="Vector Index Initialized", status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(
            content=str(e),
            media_type="application/json",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


# Endpoint to handle question requests
@app.get("/api/model/query")
def query_index(input: str):
    try:
        # Generate an answer using your GPT model
        generatedMessage = chatModel.get_response(query_str=input)

        #  https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse
        return JSONResponse(
            content=str(generatedMessage), status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(
            content=str(e),
            media_type="application/json",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


app.include_router(api_router)

# Start the server
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
