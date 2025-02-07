from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
from routes.prd_summarizer import PRDSummarizer

# Flask setup
app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow all origins for all routes

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
    """
    Calls OpenRouter DeepSeek model to generate a summarized text and a Mermaid.js diagram.
    """
    prompt = f"""
    I have the following large text that describes a process, system, or requirements:

    {text}

    1. Summarize the text while preserving key decision points, steps, and relationships between entities.
    2. Generate a structured Mermaid.js diagram in the format of a **{diagram_type}**.
    3. Ensure the diagram correctly represents the flow, dependencies, and structure.

    Return the response in this format:

    Summary:
    <Your summarized text>

    Mermaid Code:
    ```mermaid
    <Your generated Mermaid.js code>
    ```
    """
    
    # Prepare the payload for the Ollama API
    payload = {
        "model": "deepseek-r1",
        "prompt": prompt,
        "stream": False,
        "temperature": 0.0,
    }

    # try:
    #     response = requests.post(OLLAMA_API_URL, json=payload)
    #     response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
    # except requests.exceptions.Timeout:
    #     print("Request timed out. Please try again.")
    #     return None, None

    # if response.status_code != 200:
    #     print("Error:", response.status_code, response.text)
    #     return None, None

    # response_data = response.json()
    # print("Response Data:", response_data)
    
    # if "response" not in response_data or not response_data["response"]:
    #     print("Invalid response:", response_data)
    #     return None, None

    # content = response_data["response"]

    # # Extract summary and Mermaid code from response
    # summary, mermaid_code = extract_summary_and_mermaid(content)

    # return summary, mermaid_code

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    text = data['text']
    
    print("Received text for analysis:", text[:500])  # Debugging

    # prd_text = """Your product requirement document text here"""
    prd_summarizer = PRDSummarizer(text)
    result = prd_summarizer.process()

    return jsonify({
        "summarizedText": result['summarized_text'],
        "mermaid": result['mermaid_code']
    })

@app.route("/")
def hello():
    return "Hello, Flask API is running with DeepSeek AI!"

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0', debug=True)
