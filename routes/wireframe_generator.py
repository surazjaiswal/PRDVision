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
            "model": "deepseek-r1",
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
                
                # Validate JSON through API
                wireframe_components = self.validateJsonResponse(json_str)
                print("Final Wireframe components:", wireframe_components)
            else:
                raise Exception("Failed to extract valid JSON from the response.")
        else:
            raise Exception("Failed to get wireframe with DeepSeek.")

        return wireframe_components

    def validateJsonResponse(self, invalid_json_str):
        """Validate and correct JSON structure through AI processing"""
        correction_prompt = f"""
        You are a JSON syntax expert. Fix the following JSON ensuring:
        1. Strict double quotes for all strings
        2. Proper escaping of special characters
        3. No trailing commas in arrays/objects
        4. Valid nesting of brackets/braces
        5. All keys quoted properly
        
        Return ONLY valid JSON without any additional text.
        
        Invalid JSON:
        {invalid_json_str}
        """
        
        payload = {
            "model": "deepseek-r1",
            "prompt": correction_prompt,
            "stream": False
        }

        try:
            response = requests.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status()
            corrected_text = response.json().get("response", "")
            
            # Extract JSON from potential code block
            json_match = re.search(r'```json\s*(.*?)\s*```', corrected_text, re.DOTALL)
            if json_match:
                corrected_json = json_match.group(1).strip()
            else:
                corrected_json = corrected_text.strip()

            # Final validation
            return json.loads(corrected_json)
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to validate JSON: {str(e)}\nLast response: {corrected_text}")

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.wireframe_components = self.getWireframeComponents()
        return self.wireframe_components

