from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/cargo', methods=['GET'])
def get_cargo():
    # Check for system override header
    if request.headers.get('X-System-Override') == 'true':
        return "System override denied.", 418

    output_file = 'output.json'
    
    if not os.path.exists(output_file):
        return jsonify({"error": "Data file not found. Please run parser first."}), 500
        
    try:
        # Attempt to read as UTF-8 first
        with open(output_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
    except (UnicodeDecodeError, json.JSONDecodeError):
        try:
            # Fallback for common PowerShell UTF-16 redirection issue
            with open(output_file, 'r', encoding='utf-16') as f:
                data = json.load(f)
        except Exception as e:
            return jsonify({"error": f"Failed to parse JSON with UTF-8 or UTF-16: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Read error: {str(e)}"}), 500
        
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
