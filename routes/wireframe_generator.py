from transformers import pipeline, T5Tokenizer, T5ForConditionalGeneration
import requests
import re
import json

OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"

class WireframeGenerator:
    def __init__(self, prd_text):
        self.prd_text = prd_text
        self.wireframe_components = []

    def getWireframeComponents(self):
        """ AI-based text processing & structured wireframe generation """

        prompt = f"""
            You are an AI expert in product analysis, user experience design, and UI component identification. Given a Product Requirement Document (PRD), your task is to extract and map the complete user flow while identifying the required UI components.

            ### Task:
            1. **User Flow Extraction**:
            - Identify key steps, decision points, and interactions a user takes while engaging with the product.
            - Structure the user flow in a step-by-step manner, including entry points, actions, transitions, and outcomes.
            - Highlight alternative paths, edge cases, and dependencies where applicable.

            2. **UI Component Generation**:
            - Infer required UI screens and components based on extracted user actions.
            - Generate a structured representation of UI elements for each identified screen.
            - If applicable, introduce sample UI components to accommodate different scenarios.

            ### Output Format:
            The output should be a structured JSON containing a list of screens, each with its relevant UI components. The structure should resemble the following:

            ```json
            {{
                "screens": [
                    {{
                        "name": "Login Screen",
                        "components": [
                            {{"type": "TextField", "label": "Email", "placeholder": "Enter email"}},
                            {{"type": "TextField", "label": "Password", "placeholder": "Enter password", "secure": true}},
                            {{"type": "Button", "label": "Sign In", "style": "primary"}},
                            {{"type": "Link", "label": "Forgot Password?", "action": "reset_password"}},
                            {{"type": "Button", "label": "Create Account", "style": "secondary"}}
                        ]
                    }},
                    {{
                        "name": "Payment Screen",
                        "components": [
                            {{"type": "ButtonGroup", "options": ["Bank", "Paypal", "Stripe", "Cash"]}},
                            {{"type": "Button", "label": "Proceed", "style": "primary"}}
                        ]
                    }}
                ]
            }}

            {json.dumps(self.prd_text)} 

            """

        payload = {
            "model": "deepseek-coder-v2",
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(OLLAMA_API_URL, json=payload)
        print("extract_user_flows response:", response.json())

        if response.status_code == 200:
            response_text = response.json().get("response", "")
            
            # Extract JSON content from the response text
            json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)

            if json_match:
                wireframe_components = json.loads(json_match.group(1))  # Convert to a Python dictionary
            else:
                raise Exception("Failed to extract valid JSON from the response.")
        else:
            raise Exception("Failed to summarize user flow with DeepSeek.")

        return wireframe_components

        # Sample wireframe template (adjustable for AI-generated structure)
        TEMPLATE_UI_COMPONENTS = {
            "login": [
                {"type": "TextField", "label": "Email", "placeholder": "Enter email"},
                {"type": "TextField", "label": "Password", "placeholder": "Enter password", "secure": True},
                {"type": "Button", "label": "Sign In", "style": "primary"},
                {"type": "Link", "label": "Forgot Password?", "action": "reset_password"},
                {"type": "Button", "label": "Create Account", "style": "secondary"}
            ],
            "signup": [
                {"type": "TextField", "label": "First Name", "placeholder": "Enter first name"},
                {"type": "TextField", "label": "Last Name", "placeholder": "Enter last name"},
                {"type": "TextField", "label": "Email", "placeholder": "Enter email"},
                {"type": "TextField", "label": "Password", "placeholder": "Enter password", "secure": True},
                {"type": "Button", "label": "Create Account", "style": "primary"}
            ],
            "payment": [
                {"type": "ButtonGroup", "options": ["Bank", "Paypal", "Stripe", "Cash"]},
                {"type": "Button", "label": "Proceed", "style": "primary"}
            ],
            "confirmation": [
                {"type": "Text", "label": "Payment Successful"},
                {"type": "Text", "label": "Paid: $950"},
                {"type": "Button", "label": "Return to Home", "style": "primary"}
            ]
        }

        # Simulated AI decision-making: infer screens based on keywords
        screens = []
        if "login" in self.prd_text.lower():
            screens.append({"name": "Login Screen", "components": TEMPLATE_UI_COMPONENTS["login"]})
        if "signup" in self.prd_text.lower() or "register" in self.prd_text.lower():
            screens.append({"name": "Signup Screen", "components": TEMPLATE_UI_COMPONENTS["signup"]})
        if "payment" in self.prd_text.lower() or "checkout" in self.prd_text.lower():
            screens.append({"name": "Payment Screen", "components": TEMPLATE_UI_COMPONENTS["payment"]})
        if "confirmation" in self.prd_text.lower() or "success" in self.prd_text.lower():
            screens.append({"name": "Confirmation Screen", "components": TEMPLATE_UI_COMPONENTS["confirmation"]})

        return {"screens": screens}
    

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.wireframe_components = self.getWireframeComponents()
        
        return {
            "wireframes": self.wireframe_components
        }

