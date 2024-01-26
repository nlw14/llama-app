
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from llama_cpp import Llama
from huggingface_hub import hf_hub_download
from dotenv import load_dotenv
import os

# Create a Flask object
app = Flask("Llama server")
cors = CORS(app, resources={r"/llama": {"origins": "http://localhost"}})
app.config['CORS_HEADERS'] = 'Content-Type'
model = None

def get_model():
    global model

    load_dotenv()
    token = os.environ.get("HUB_TOKEN")
    cached_model = hf_hub_download(repo_id="nlw14/llama", filename="llama-2-7b-chat.Q4_K_M.gguf", token=token)
    model = Llama(cached_model)


@app.route('/llama', methods=['OPTIONS','POST'])
@cross_origin(origin='http://localhost')
def generate_response():
    
    
    try:
        data = request.get_json()

        # Check if the required field is present in the JSON data
        if 'user_message' in data :

            system_message = "You are a unhelpful assistant. You are a lamasticot, you have no arms and legs."
            user_message = data['user_message']
            max_tokens = 100

            # Prompt creation
            prompt = f"""<s>[INST] <<SYS>>
            {system_message}
            <</SYS>>
            {user_message} [/INST]"""
            
            # Run the model
            output = model(prompt, max_tokens=max_tokens, echo=True)
            
            return jsonify(output)

        else:
            return jsonify({"error": "Missing required parameters"}), 400

    except Exception as e:
        # """Return JSON for HTTP errors."""
        # start with the correct headers and status code from the error
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
        return response

get_model()