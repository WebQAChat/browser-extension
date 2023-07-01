from flask import Flask, jsonify, request
from models import model  # Replace with your GPT model code

app = Flask(__name__)
chatModel = model.WebChatModel("gpt4")


@app.route("/")
def index():
    return "home page", 200


# Endpoint to handle question requests
@app.route("/api/query", methods=["GET"])
def query_index():
    global index
    query_text = request.args.get("question", None)

    # retrieve the url of the website the user is currently on
    # need to be updated
    # urls = request.args.get("urls", None)

    # chatModel.prepare_data(urls)

    # Generate an answer using your GPT model
    response = chatModel.get_response(query_str=query_text)

    return str(response), 200


# Start the server
if __name__ == "__main__":
    app.run(debug=True)  # Set debug=False for production environment
