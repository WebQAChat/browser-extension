from typing import List, Optional

import uvicorn
from fastapi import APIRouter, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from models import model


class Tab(BaseModel):
    tabId: str
    urls: List[str]


class ChatbotType(BaseModel):
    modelName: str


app = FastAPI()

# Set up CORS middleware
origins = [
    "moz-extension://5bb738060378a4a72a726fb7ba20e4cc0bd2aee9@temporary-addon",
]
# Use a more restrictive setting in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()

chatModel = model.WebChat()


@app.post("/api/model/init")
def init_chatbot(type: ChatbotType):
    try:
        print("chatbot type: ", type.modelName)
        # chatModel.set_vector_index(model_name=type.modelName)

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
@app.post("/api/model/query")
async def query_index(input: str):
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
