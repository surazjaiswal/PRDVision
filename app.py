from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pdfplumber
import docx
from transformers import pipeline
import spacy

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow all origins for all routes

# Load NLP models
summarizer = pipeline("summarization")
nlp = spacy.load("en_core_web_sm")  # Small, efficient NLP model

# Function to extract text from PDF
def extract_text_pdf(file_path):
    print("Extracting text from PDF...")
    with pdfplumber.open(file_path) as pdf:
        text = ''.join(page.extract_text() for page in pdf.pages if page.extract_text())
    print("Extracted PDF Text:", text[:500])
    return text

# Function to extract text from DOCX
def extract_text_docx(file_path):
    print("Extracting text from DOCX...")
    doc = docx.Document(file_path)
    text = '\n'.join([para.text for para in doc.paragraphs])
    print("Extracted DOCX Text:", text[:500])
    return text

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "OPTIONS, GET, POST"
    return response

# API endpoint to analyze text and generate flowchart/mindmap
@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Invalid request format"}), 400
    
    text = data['text']
    print("Received text for analysis:", text[:500])  # Print first 500 characters

    # Summarize text (optional)
    summarized_text = summarizer(text, max_length=150, min_length=30, do_sample=False)[0]['summary_text']
    print("Summarized Text:", summarized_text)

    # Extract key actions and decisions
    doc = nlp(text)
    actions = [token.lemma_ for token in doc if token.pos_ in ["VERB", "NOUN"]]
    print("Extracted Actions:", actions)

    # Generate flowchart nodes & edges
    flowchart_nodes = [{"id": i+1, "label": action, "type": "process"} for i, action in enumerate(actions[:5])]
    flowchart_edges = [{"from": i, "to": i+1} for i in range(1, len(flowchart_nodes))]

    if flowchart_nodes:
        flowchart_nodes.insert(0, {"id": 0, "label": "Start", "type": "start"})
        flowchart_nodes.append({"id": len(flowchart_nodes), "label": "End", "type": "end"})
        flowchart_edges.append({"from": len(flowchart_nodes) - 2, "to": len(flowchart_nodes) - 1})

    flowchart_data = {"type": "flowchart", "nodes": flowchart_nodes, "edges": flowchart_edges}

    # Generate mind map data
    mind_map_data = {
        "type": "mindmap",
        "nodes": [{"id": 0, "label": "Document Analysis", "children": [{"id": i+1, "label": action} for i, action in enumerate(actions[:5])]}]
    }

    return jsonify({"flowchart": flowchart_data, "mindMapData": mind_map_data})

@app.route("/")
def hello():
    return "hello"

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0')
