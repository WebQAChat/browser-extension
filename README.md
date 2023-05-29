## A chrome browser extension that can answer your questions about a webpage

### Tasks:
Task 1. This is optional but it will be helpful for everyone to first understand how llama index works:
  - [ ] Familiarize yourself with the Llama Index API and its documentation https://gpt-index.readthedocs.io/en/latest/getting_started/installation.html
    * [ ] We will be using GPTVectorStoreIndex https://gpt-index.readthedocs.io/en/latest/how_to/index_structs/vector_store_guide.html to create vector embeddings for each context
  - [ ] Take a look at DataLoader (classes to load data from different sources) called Web Page Reader https://gpt-index.readthedocs.io/en/latest/examples/data_connectors/WebPageDemo.html where it scraped content from the url of a webpage

Task 2. You will need your own openai api key to run the extension:
  - [ ] Create an openai account, if you don’t have one, and obtain an access API key

For the following two tasks, I could either assign people or let you guys choose. Since we have four people, two people for each task would be sufficient:

Task 3. Frontend:
  - [ ] Plan the layout and design of the chatbot interface within the browser extension.
    * [ ] Create HTML/CSS templates to structure and style the interface.
    * [ ] Write JavaScript code (in background.js, content.js, popup.js) to show the input screen when the user click on the chatbot icon
    
Task 4. Backend (Part 1):
  - [ ] Implement the chatbot functionality:
    * [ ] Write JavaScript code (in background.js, content.js) to handle user input and generate responses.
    * [ ] Utilize the trained GPT model to generate dynamic responses based on user queries.

Task 5. Backend (Part 2):
  - [ ] Set up a backend server to handle the indexing and search requests. This server will receive requests from your web extension and interact with the Llama Index library to perform the necessary operations.
  - [ ] Need to consider between rest api (backend frameworks like Django, Flask, and FastAPI) or web sockets
  - [ ] Might use web sockets for our case
    * [ ] Integrate the Llama Index API calls to provide additional information or context.


### Making Pull Requests
If you need a reference: https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github

### Lists of Tutorials:
- How to create a Chrome extension for GPT-3 questions with ReactJS: https://norahsakal.com/blog/create-gpt3-chrome-extension
- This is an open source project: https://github.com/interstellard/chatgpt-advanced/tree/main/src
- Django vs Fast API: A Detailed Comparison: https://medium.com/@ShortHills_Tech/django-vs-fast-api-a-detailed-comparison-df8d00f3c3b2
- What are web sockets?: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- WebSocket vs REST: Key differences and which to use: https://ably.com/topic/websocket-vs-rest
- Building a WebSocket Server With Python: https://www.piesocket.com/blog/python-websocket
