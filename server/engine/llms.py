from llama_index.llms.huggingface import HuggingFaceLLM, HuggingFaceInferenceAPI
import os
from dotenv import load_dotenv

load_dotenv()

# llm_mistral_ai = HuggingFaceLLM(model_name="mistralai/Mixtral-8x7B-Instruct-v0.1")
llm_mistral_ai_inference_api = HuggingFaceInferenceAPI(
    model_name="mistralai/Mixtral-8x7B-Instruct-v0.1",
    token=os.environ.get("HF_TOKEN"),
)
