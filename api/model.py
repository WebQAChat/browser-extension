from openai import OpenAI, Completion

openai = OpenAI(api_key="YOUR_OPENAI_API_KEY")

def generate_answer(question, context):
    message = {
        'role': 'system',
        'content': 'You are a helpful assistant.'
    },
    {
        'role': 'user',
        'content': context
    },
    {
        'role': 'user',
        'content': question
    }
    response = openai.Completion.create(
      engine="text-davinci-002",  
      messages=message,
      max_tokens=150
    )

    return response['choices'][0]['message']['content']
