from flask import Flask, jsonify, request
from model import generate_answer  # Replace with your GPT model code

app = Flask(__name__)


# Endpoint to handle question requests
@app.route("/api/question", methods=["POST"])
def handle_question():
    question = request.json["question"]
    context = request.json["context"]  # Get context from the request

    # Generate an answer using your GPT model
    answer = generate_answer(question, context)

    # Send the answer back to the frontend
    return jsonify({"answer": answer})

# Start the server
if __name__ == "__main__":
    app.run(debug=True)  # Set debug=False for production environment
