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
            You are an AI expert in product analysis, user experience design, and UI component identification. Given a Product Requirement Document (PRD) summary, extract a structured user journey while identifying necessary UI screens and components.

            Task Details:
                1. User Flow Extraction:
                    - Analyze the given PRD text to break down the user journey into clear sequential steps.
                    - Identify all possible user actions, transitions, decision points, and alternative flows.

                2. UI Component Mapping:
                    - Infer the required UI screens based on extracted user actions.
                    - Generate a structured representation of UI components for each identified screen.
                    - Include essential UI elements such as text fields, buttons, modals, dropdowns, notifications, and other interactive components.
                    - If applicable, introduce sample UI elements to accommodate different scenarios.

            Input Format (Example):
            A user flow from a PRD detailing a mobile banking app process, including login, balance inquiry, fund transfer, and security handling.

            Expected Output (JSON Format):
            Generate a well-structured JSON output containing:
                - Screens: A list of UI screens with relevant UI components.
                - Components: Details of UI elements, including their type, labels, and properties.
                - Alternative Paths: Handling of edge cases or alternative user flows.

            Example Output:
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
                        "name": "Dashboard",
                        "components": [
                            {{"type": "Card", "label": "Account Balance", "value": "$5000"}},
                            {{"type": "List", "label": "Recent Transactions", "items": ["Grocery - $50", "Netflix - $12"]}},
                            {{"type": "Button", "label": "Transfer Money", "style": "primary"}}
                        ]
                    }},
                    {{
                        "name": "Transfer Screen",
                        "components": [
                            {{"type": "TextField", "label": "Recipient", "placeholder": "Enter account number"}},
                            {{"type": "TextField", "label": "Amount", "placeholder": "Enter amount"}},
                            {{"type": "Button", "label": "Review Transfer", "style": "primary"}}
                        ]
                    }}
                ],
                "alternative_paths": [
                    {{
                        "name": "Forgot Password",
                        "flow": "User clicks on 'Forgot Password' → Enters email → Receives reset link → Creates a new password."
                    }},
                    {{
                        "name": "Network Error Handling",
                        "flow": "If network is weak, user receives a retry prompt with alternative login options."
                    }}
                ]
            }}
            ```
            Instructions for OpenAI:
                1. Ensure the output is structured, detailed, and logically mapped to user actions.
                2. Maintain a clear and readable format that directly aligns UI components with user flow steps.
                3. Identify alternative paths and edge cases in the flow.
                4. Focus on usability, clarity, and completeness in UI component generation.


            PRD summary for which wireframe components need to be extracted: {self.prd_text}

            """
        
        payload = {
            "model": "deepseek-coder-v2",
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(OLLAMA_API_URL, json=payload)
        print("\n\nAPI Response Status Code:", response.status_code)
        print("\nAPI Response Content:", response.text)  # Print raw response for debugging
        print("\nWireframe response:", response.json())

        if response.status_code == 200:
            response_text = response.json().get("response", "")
            print("Wireframe prompt resoonse:", response_text)

            # Extract JSON content from the response text
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)

            if json_match:
                json_str = json_match.group(1).strip()
                wireframe_components = json.loads(json_str)
                print("Wireframe components:", wireframe_components)
            else:
                raise Exception("Failed to extract valid JSON from the response.")
        else:
            raise Exception("Failed to summarize user flow with DeepSeek.")

        return wireframe_components

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.wireframe_components = self.getWireframeComponents()
        return self.wireframe_components

