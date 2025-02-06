from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
from transformers import pipeline

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow all origins for all routes

# Load summarization model from Hugging Face
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=-1)

# Function to extract text from PDF
def extract_text_pdf(file_path):
    print("Extracting text from PDF...")
    with pdfplumber.open(file_path) as pdf:
        text = ''.join(page.extract_text() for page in pdf.pages if page.extract_text())
    print("Extracted PDF Text:", text[:500])  # Debugging
    return text

# Function to extract text from DOCX
def extract_text_docx(file_path):
    print("Extracting text from DOCX...")
    doc = docx.Document(file_path)
    text = '\n'.join([para.text for para in doc.paragraphs])
    print("Extracted DOCX Text:", text[:500])  # Debugging
    return text

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "OPTIONS, GET, POST"
    return response

def generate_mermaid_flowchart(summary):
    """
    Converts summarized text into a Mermaid flowchart format.
    """
    sentences = summary.split('. ')
    nodes = []
    edges = []
    
    for i, sentence in enumerate(sentences):
        node_id = f"A{i}"
        nodes.append(f'{node_id}["{sentence.strip()}"]')
        if i > 0:
            edges.append(f"A{i-1} --> {node_id}")
    
    # Assemble Mermaid flowchart
    mermaid_chart = "graph TD\n    " + "\n    ".join(nodes + edges)
    
    return mermaid_chart

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    text = data['text']
    
    print("Received text for analysis:", text[:500])  # Debugging

    # Summarize the text
    summarized_text = summarizer(text, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
    
    # Generate Mermaid.js flowchart from summary
    mermaid_flowchart = generate_mermaid_flowchart(summarized_text)

    # Structured JSON Flowchart Example
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

    # Mind Map Example
    mind_map_data = {
        "type": "mindmap",
        "nodes": [
            {"id": 1, "label": "Main Idea", "children": [{"id": 2, "label": "Sub Idea 1"}, {"id": 3, "label": "Sub Idea 2"}]}
        ]
    }

    return jsonify({
        "summarizedText": summarized_text,
        "flowchart": flowchart_data,
        "mindMapData": mind_map_data,
        "mermaid": mermaid_flowchart
    })

@app.route("/")
def hello():
    return "Hello, Flask API is running!"

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0', debug=True)
