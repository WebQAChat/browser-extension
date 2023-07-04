from flask import Flask, jsonify, request, render_template
from models import model  # Replace with your GPT model code

app = Flask(__name__)
chatModel = model.WebChatModel("gpt4")

# Show popup.html when call route '/'
@app.route("/")
def index():
    return render_template('popup.html')

# Test api
# @app.route('/post', methods=["GET"])
# def testpost():
#     message = request.args.get('message', None)
#     returnArray = {
#         'status':True,
#         'data': 'Your message is ' + "( " + message + " )"
#     }
#     return jsonify(returnArray), 200

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
    generatedMessage = chatModel.get_response(query_str=query_text)

    return str(generatedMessage), 200


# Start the server
if __name__ == "__main__":
    app.run(debug=True)  # Set debug=False for production environment
