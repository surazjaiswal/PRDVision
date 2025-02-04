from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
from transformers import pipeline
from flask import make_response


app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow all origins for all routes

# Load summarization model from Hugging Face
summarizer = pipeline("summarization")

# Function to extract text from PDF
def extract_text_pdf(file_path):
    print("Extracting text from PDF...")
    with pdfplumber.open(file_path) as pdf:
        text = ''.join(page.extract_text() for page in pdf.pages if page.extract_text())
    print("Extracted PDF Text:", text)
    return text

# Function to extract text from DOCX
def extract_text_docx(file_path):
    print("Extracting text from DOCX...")
    doc = docx.Document(file_path)
    text = '\n'.join([para.text for para in doc.paragraphs])
    print("Extracted DOCX Text:", text)
    return text


@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "OPTIONS, GET, POST"
    return response

# @app.route('/analyze', methods=['OPTIONS'])
# def analyze_options():
#     return make_response('', 204)


# API endpoint to analyze text and generate flowchart/mindmap
@app.route('/analyze', methods=['POST','GET'])
def analyze_text():
    data = request.get_json()
    text = data['text']
    
    print("Received text for analysis:", text[:500])  # Print first 500 characters

    # Dummy example for flowchart and mind map data
    flowchart_data = {
        "type": "flowchart",
        "nodes": [
            {"id": 1, "label": "Start", "type": "start"},
            {"id": 2, "label": "Process", "type": "process"},
            {"id": 3, "label": "End", "type": "end"}
        ],
        "edges": [
            {"from": 1, "to": 2},
            {"from": 2, "to": 3}
        ]
    }

    mind_map_data = {
        "type": "mindmap",
        "nodes": [
            {"id": 1, "label": "Main Idea", "children": [{"id": 2, "label": "Sub Idea 1"}, {"id": 3, "label": "Sub Idea 2"}]}
        ]
    }

    return jsonify({
        "flowchart": flowchart_data,
        "mindMapData": mind_map_data
    })

@app.route("/")
def hello():
    return "hello"

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0')
