from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
# This line COMPLETELY DELETES CORS for every single request
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/groq-proxy', methods=['POST'])
def proxy():
    # 1. Grab the data and headers from your browser
    url = "https://groq.com"
    headers = {
        "Authorization": request.headers.get("Authorization"),
        "Content-Type": "application/json"
    }
    
    # 2. Trick Groq: Send the data from Python (where CORS is ignored)
    response = requests.post(url, headers=headers, json=request.json)
    
    # 3. Return the AI's answer back to your Wiki
    return jsonify(response.json())

if __name__ == '__main__':
    print("SYSTEM HACKED: CORS is now dead at http://localhost:8000")
    app.run(port=8000)
