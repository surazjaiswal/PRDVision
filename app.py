from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.prd_summarizer import PRDSummarizer
from routes.wireframe_generator import WireframeGenerator

# Flask setup
app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow all origins for all routes

GEMINI_API_KEY = "AIzaSyCA390S2PrSWRV5RDgCz4mEAmUkh-y4DTI"

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    text = data['text']
    
    print("Received text for analysis:", text)  # Debugging

    prd_summarizer = PRDSummarizer(api_key=GEMINI_API_KEY, prd_text=text)
    result = prd_summarizer.process()
    
    wireframes = getWireframes(text)
    print("\n\n\nWireframes:", wireframes)
    
    resJson = jsonify({
        "summarizedText": result['summarized_text'],
        "Flowchart": result['mermaid_code'],
        "wireframes": wireframes
    })

    return resJson

def getWireframes(text):
    generator = WireframeGenerator(GEMINI_API_KEY, text)
    result = generator.process()
    return result
    

def getSampleWireframes():
    return {
    "screens": [
        {
            "name": "Login/Register Screen",
            "components": [
                {"type": "TextField", "label": "Email", "placeholder": "Enter email"},
                {"type": "TextField", "label": "Password", "placeholder": "Enter password", "secure": True},
                {"type": "Button", "label": "Sign In", "style": "primary"},
                {"type": "Button", "label": "Register", "style": "secondary"}
            ]
        },
        {
            "name": "Dashboard",
            "components": [
                {"type": "Card", "title": "Quiz History", "description": "View past quizzes"},
                {"type": "Card", "title": "Recommendations", "description": "AI suggested quizzes"},
                {"type": "Card", "title": "Stats", "description": "Performance analytics"}
            ]
        },
        {
            "name": "Quiz Page",
            "components": [
                {"type": "QuestionDisplay", "questionType": "MCQs", "options": ["Option A", "Option B", "Option C", "Option D"]},
                {"type": "Timer", "duration": 300},
                {"type": "AnswerInput", "placeholder": "Enter answer"}
            ]
        },
        {
            "name": "Results Page",
            "components": [
                {"type": "ScoreDisplay", "score": "8/10"},
                {"type": "Feedback", "feedback": "Good job, some answers need more explanation."},
                {"type": "AnswersList", "answers": ["Correct", "Incorrect"]}
            ]
        },
        {
            "name": "Admin Panel",
            "components": [
                {"type": "Table", "title": "Manage Users", "columns": ["Username", "Email"], "actions": ["Edit", "Delete"]},
                {"type": "Table", "title": "Manage Quizzes", "columns": ["Quiz Name", "Topic"], "actions": ["View Results", "Delete"]},
                {"type": "SettingsForm", "fields": [
                    {"label": "Theme", "options": ["Light", "Dark"]},
                    {"label": "Language", "options": ["English", "Spanish"]}
                ]}
            ]
        }
    ]
}

@app.route("/")
def hello():
    return "Hello, Flask API is running with DeepSeek AI!"

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0', debug=True)
