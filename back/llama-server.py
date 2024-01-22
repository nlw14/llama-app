
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from llama_cpp import Llama

# Create a Flask object
app = Flask("Llama server")
cors = CORS(app, resources={r"/llama": {"origins": "localhost:80/"}})
app.config['CORS_HEADERS'] = 'Content-Type'
model = None

@app.route('/llama', methods=['POST'])
@cross_origin(origin='localhost:80/',headers=['Content-Type','Authorization'])
def generate_response():
    global model
    
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
            
            # Create the model if it was not previously created
            if model is None:
                # Put the location of to the GGUF model that you've download here
                model_path = "./model/llama-2-7b-chat.Q4_K_M.gguf"
                
                # Create the model
                model = Llama(model_path=model_path)
             
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)