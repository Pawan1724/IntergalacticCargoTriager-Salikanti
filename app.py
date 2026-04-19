from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

@app.route('/api/cargo', methods=['GET'])
def get_cargo():
    output_file = 'output.json'
    
    if not os.path.exists(output_file):
        return jsonify({"error": "Data file not found. Please run parser first."}), 500
        
    with open(output_file, 'r') as f:
        data = json.load(f)
        
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
