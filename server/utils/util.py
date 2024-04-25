import requests


def validate(token: str):
    api_endpoint = "https://api.openai.com/v1/chat/completions"
    api_key = token

    headers = {
        "Content-Type" : "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    messages = [
        {"role": "user", "content": "Say this is a test!"}
    ]

    data = {
        "model": "gpt-3.5-turbo",
        "messages": messages
    }

    response = requests.post(api_endpoint, json=data, headers=headers)
    return response