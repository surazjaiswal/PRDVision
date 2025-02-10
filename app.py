from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.prd_summarizer import PRDSummarizer
from routes.wireframe_generator import WireframeGenerator

# Flask setup
app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # Allow all origins for all routes


@app.route("/generate-wireframe", methods=["POST"])
def generate_wireframe():
    """ API endpoint that receives PRD text and returns structured UI JSON """
    data = request.json
    prd_text = data.get("text", "")

    if not prd_text:
        return jsonify({"error": "No text provided"}), 400

    wireframe_data = WireframeGenerator(prd_text)
    return jsonify({"wireframe": wireframe_data})


@app.route('/analyze', methods=['POST'])
def analyze_text():

    

    data = request.get_json()
    text = data['text']

    return defaultResponse(text)
    
    print("Received text for analysis:", text)  # Debugging

    prd_summarizer = PRDSummarizer(text)
    result = prd_summarizer.process()

    print("Summarized Text:\n", result['summarized_text'])
    print("\nUser Flows:\n", result['user_flows'])
    print("\nUI Components:\n", result['ui_components'])
    print("\nMermaid Diagram Code:\n", result['mermaid_code'])

    resJson = jsonify({
        "summarizedText": result['summarized_text'],
        "mermaid": result['mermaid_code'],
        "userFlow": result['user_flows'],
        "uiComponent": result['ui_components']
    })

    return resJson


def defaultResponse(text):
    summarized_text = """
    AI-Based Quiz System
    The AI-Based Quiz System is an intelligent platform designed to generate, evaluate, and analyze quizzes using artificial intelligence (AI). It supports multiple question formats, adaptive learning, real-time feedback, and performance analytics, catering to students, professionals, and organizations seeking interactive knowledge enhancement.

    Key Features:
    ✅ AI-Generated Quizzes – Supports MCQs, True/False, Fill in the Blanks, and Short Answers
    ✅ Adaptive Learning – Adjusts difficulty based on user performance
    ✅ Quiz Modes – Timer-based and untimed quizzes
    ✅ Real-Time Feedback – Provides explanations and performance insights
    ✅ Custom Quizzes – Instructors can manually create quizzes or generate them using AI
    ✅ Performance Analytics – Tracks progress and suggests personalized improvement plans

    Core UI Components:
    📌 Login/Register Screen – Secure authentication for users
    📌 Dashboard – Displays quiz history, recommendations, and user stats
    📌 Quiz Page – Interactive interface with questions, answer inputs, and timers
    📌 Results Page – Score breakdown, AI feedback, and improvement suggestions

    System Architecture:
    🔹 Backend: API-driven architecture using Node.js, Django, or Flask
    🔹 AI Integration: Powered by OpenAI & Hugging Face models
    🔹 Database: Supports PostgreSQL & MongoDB
    🔹 Frontend: Web (React.js/Next.js) & Mobile (Flutter/React Native)

    Future Enhancements:
    🚀 AI-Powered Voice-Based Quizzes – Voice-activated quiz interactions
    🏆 Gamification Elements – Leaderboards, badges, and achievement rewards
    📚 LMS Integration – Seamless connection with learning management systems

    Stay ahead with AI-driven learning & assessment! 🎯 """

    mermaid_code = """graph TD;
    subgraph Login/Register
        A[Login/Register Screen] --> B{Auth Success?}
        B -- Yes --> C[Dashboard]
        B -- No --> D[Error Message]
        D --> E{Retry or Register?}
        E --> F[Login/Register Screen]
        E --> G[Dashboard]
    end
    
    subgraph Dashboard
        H[View Past Quizzes] --> I[Quiz History Displayed]
        J[See Recommendations] --> K[Recommended Quiz Displayed]
        L[Initiate New Quiz] --> M[Quiz Page]
    end
    
    subgraph Quiz Page
        N[Question View] --> O{Immediate Feedback?}
        O -- Yes --> P[Next Question]
        O -- No --> Q[End of Timer]
        Q --> R[Results Page]
    end
    
    subgraph Results Page
        S[Review Answers] --> T[AI Feedback]
        U[Retake Quiz] --> M
        V[Continue with Other Quizzes] --> C
    end
    
    subgraph Custom Quiz Creation
        W[Instructor Accesses Tools] --> X{Manual or AI Assistance?}
        X -- Manual --> Y[Create Questions and Answers]
        X -- AI --> Z[AI Generates Content]
        Y --> AA[Custom Quiz Available]
        Z --> AA
    end
    
    subgraph Performance Monitoring
        BB[Instructor Views Analytics] --> CC[Detailed Reports]
        DD[Personalized Improvement Plans] --> EE[Future Enhancements]
    end
    
    subgraph Future Enhancements
        FF[AI-powered Voice Quizzes] --> GG[Gamification Elements]
        HH[Integration with LMS] --> II[Expected in Future Versions]
    end
    
    subgraph Technical Issues
        JJ[System Error] --> KK[Retry or Manual Reset]
        LL[Incorrect Answer Display] --> MM[Manual Correction]
    end
    
    subgraph User Errors
        NN[Mistyping Credentials] --> OO[Guidelines for Correct Path]
        PP[Selecting Wrong Answers] --> QQ[Corrective Actions]
        RR[Navigating Incorrectly] --> SS[UI Re-orientation]
    end
    
    subgraph Performance Anxiety
        TT[Time Pressure] --> UU[Hints and Fast Options]
        VV[Accuracy Focused] --> WW[No Jeopardy]
    end
    """
    user_flows = []
    ui_components = []
    wireframes = getWireframes(text)
    # wireframes = getSampleWireframes()


    resJson = jsonify({
        "summarizedText": summarized_text,
        "mermaid": mermaid_code,
        "userFlow": user_flows,
        "uiComponent": ui_components,
        "wireframes": wireframes
    })

    return resJson

def getWireframes(text):
    generator = WireframeGenerator(text)
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
