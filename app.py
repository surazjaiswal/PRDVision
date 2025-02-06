from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import requests
import json
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

# Function to call DeepSeek AI model via OpenRouter
def call_deepseek_summarization(text, diagram_type="mindmap"):
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
        "stream": False
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

def extract_summary_and_mermaid(content):
    """
    Extracts the summary and Mermaid.js code from the AI response.
    """
    summary = ""
    mermaid_code = ""

    lines = content.split("\n")
    is_mermaid = False

    for line in lines:
        if "Mermaid Code:" in line:
            is_mermaid = True
            continue
        if is_mermaid:
            mermaid_code += line + "\n"
        else:
            summary += line + " "

    return summary.strip(), mermaid_code.strip()

@app.route('/analyze', methods=['POST'])
def analyze_text():
    # data = request.get_json()
    # text = data['text']

    # Hardcoded string for testing
    text = """
    Product Vision: Develop a mobile banking application
    Key Requirements:
    - The app should provide secure user authentication
    - Users must be able to view account balances instantly
    - Transfer functionality will support multiple bank accounts
    - Real-time transaction notifications are crucial
    - Implement multi-factor authentication for enhanced security
    Key Features:
    1. Biometric login options
    2. Instant balance check
    3. Secure fund transfers
    4. Transaction history tracking
    5. Spending analysis tools
    Target Market:
    Young professionals aged 25-40 who prefer digital banking solutions
    """
    
    print("Received text for analysis:", text[:500])  # Debugging

    # prd_text = """Your product requirement document text here"""
    prd_summarizer = PRDSummarizer(text)
    result = prd_summarizer.process()

    print("Summarized Text:\n", result['summarized_text'])
    print("\nUser Flows:\n", result['user_flows'])
    print("\nUI Components:\n", result['ui_components'])
    print("\nMermaid Diagram Code:\n", result['mermaid_code'])

    # return call_deepseek_summarization(text, diagram_type="flowchart")
    # Call DeepSeek AI to get summarized text and Mermaid flowchart
    # summarized_text, mermaid_flowchart = call_deepseek_summarization(text, diagram_type="flowchart")

    # Fallback if AI fails
    # if not summarized_text or not mermaid_flowchart:
    #     return jsonify({"error": "Failed to generate summary and Mermaid diagram."}), 500

    # print("Summarized Text:", summarized_text)
    # print("Mermaid Flowchart:", mermaid_flowchart)

    return jsonify({
        "summarizedText": result['summarized_text'],
        "mermaid": result['mermaid_code']
    })

@app.route("/")
def hello():
    return "Hello, Flask API is running with DeepSeek AI!"

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0', debug=True)
