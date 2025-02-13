from transformers import pipeline, T5Tokenizer, T5ForConditionalGeneration
import requests
import re
import json

class WireframeGenerator:
    def __init__(self, api_key, prd_text):
        self.prd_text = prd_text
        self.wireframe_components = []
        self.api_key = api_key
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    def getWireframeComponents(self):
        """ AI-based text processing & structured wireframe generation """

        prompt = f"""
        You are an AI expert in product analysis, user experience design, and UI component identification. Given a Product Requirement Document (PRD) summary, extract a structured user journey while identifying necessary UI screens and components.

        Task Details:
        1. User Flow Extraction:
        - Analyze the PRD text to break down the user journey into clear sequential steps
        - Identify user actions, transitions, decision points, and alternative flows

        2. UI Component Mapping:
        - Infer required UI screens from user actions
        - Generate structured UI components for each screen
        - Include elements like text fields, buttons, modals, dropdowns, notifications
        - Introduce sample elements for different scenarios

        JSON Structure Requirements:
        - Use double quotes ONLY
        - No trailing commas in arrays/objects
        - All string values must be quoted
        - Escape special characters with \\
        - Validate bracket/brace nesting

        Example Output Structure:
        {{
            "screens": [
                {{
                    "name": "Screen Name",
                    "components": [
                        {{"type": "TextField", "label": "Email", "placeholder": "Enter email"}},
                        {{"type": "Button", "label": "Submit", "action": "submit"}}
                    ]
                }}
            ],
            "alternative_paths": [
                {{
                    "name": "Error Handling",
                    "flow": "User sees error message if input is invalid"
                }}
            ]
        }}

        Special Instructions:
        1. Validate JSON syntax before finalizing
        2. Keep text values simple and escape-free
        3. Maintain consistent indentation
        4. Avoid line breaks in JSON values

        PRD Summary to Analyze:
        {self.prd_text}

        Generate only raw JSON output without any commentary.
        """

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print("\n\nAPI Response Status Code:", response.status_code)
        print("\nAPI Response Content:", response.text)
        print("\nWireframe response:", response.json())

        if response.status_code == 200:
            candidates = response.json().get("candidates", [])
            if candidates:
                response_text = candidates[0]["content"]["parts"][0]["text"]
                print("Wireframe prompt response:", response_text)
                
                try:
                    wireframe_components = self.validateJsonResponse(response_text)
                    print("Final Wireframe components:", wireframe_components)
                except Exception as e:
                    raise Exception("Failed to extract valid JSON from the response.") from e
            else:
                raise Exception("No candidates found in response.")
        else:
            raise Exception("Failed to get wireframe with Gemini API.")


        return wireframe_components
    
    def validateJsonResponse(self, json_str):
        try:
            import json
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            raise Exception("Invalid JSON format.") from e

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.wireframe_components = self.getWireframeComponents()
        return self.wireframe_components

