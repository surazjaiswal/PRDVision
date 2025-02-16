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
        """AI-based text processing & structured wireframe generation"""

        prompt = f"""
        You are an AI expert in product analysis, user experience design, and UI component identification. Given a Product Requirement Document (PRD) summary, extract a structured user journey while identifying necessary UI screens and components.

        Task Details:
        1. User Flow Extraction:
        - Analyze the PRD text to break down the user journey into clear sequential steps
        - Identify user actions, transitions between screens, and decision points
        - Establish connections between screens using edge relationships

        2. UI Component Mapping:
        - Infer required UI screens from user actions
        - Generate structured UI components for each screen
        - Include elements like text fields, buttons, modals, dropdowns, notifications
        - Include modern UI elements (avatars, progress bars, switches) where appropriate

        JSON Structure Requirements:
        - Use double quotes ONLY
        - No trailing commas in arrays/objects
        - All string values must be quoted
        - Escape special characters with \\\\
        - Validate bracket/brace nesting
        - Maintain screen order based on user flow

        Example Output Structure:
        {{
            "screens": [
                {{
                    "label": "Login",
                    "components": [
                        {{ "type": "TextField", "label": "Email" }},
                        {{ "type": "TextField", "label": "Password" }},
                        {{ "type": "Button", "label": "Login" }},
                        {{ "type": "Button", "label": "Sign Up" }}
                    ]
                }},
                {{
                    "label": "Sign Up",
                    "components": [
                        {{ "type": "TextField", "label": "Full Name" }},
                        {{ "type": "TextField", "label": "Email" }},
                        {{ "type": "TextField", "label": "Password" }},
                        {{ "type": "TextField", "label": "Confirm Password" }},
                        {{ "type": "Button", "label": "Create Account" }}
                    ]
                }},
                {{
                    "label": "Home Feed",
                    "components": [
                        {{ "type": "Avatar", "src": "https://example.com/user1.jpg" }},
                        {{ "type": "TextField", "label": "What's on your mind?" }},
                        {{ "type": "Button", "label": "Post" }},
                        {{ "type": "ImageView", "src": "https://example.com/post1.jpg" }},
                        {{ "type": "VideoView", "src": "https://example.com/video1.mp4" }},
                        {{ "type": "Progress", "progress": 80 }},
                        {{ "type": "Switch", "label": "Show Online Status" }}
                    ]
                }},
                {{
                    "label": "Profile",
                    "components": [
                        {{ "type": "Avatar", "src": "https://example.com/user1.jpg" }},
                        {{ "type": "Tabs", "tabs": ["Posts", "About", "Connections"] }},
                        {{ "type": "Progress", "progress": 90 }},
                        {{ "type": "Slider", "value": 50 }}
                    ]
                }},
                {{
                    "label": "Connections",
                    "components": [
                        {{ "type": "Avatar", "src": "https://example.com/user2.jpg" }},
                        {{ "type": "Avatar", "src": "https://example.com/user3.jpg" }},
                        {{ "type": "Dropdown", "options": ["Sort by Name", "Sort by Recent"] }}
                    ]
                }},
                {{
                    "label": "Settings",
                    "components": [
                        {{ "type": "Switch", "label": "Dark Mode" }},
                        {{ "type": "Switch", "label": "Enable Notifications" }},
                        {{ "type": "Button", "label": "Logout" }}
                    ]
                }}
            ],
            "edges": [
                {{ "from": 0, "to": 1 }},
                {{ "from": 1, "to": 2 }},
                {{ "from": 2, "to": 3 }},
                {{ "from": 2, "to": 4 }},
                {{ "from": 3, "to": 5 }}
            ]
        }}

        Special Instructions:
        1. Validate JSON syntax before finalizing
        2. Number edges based on screen array indexes (0-based)
        3. Include both primary flows and alternative paths in edges
        4. Maintain component consistency across similar screens
        5. Include rich media components (Image/Video views) where relevant

        PRD Summary to Analyze:
        {self.prd_text}

        Generate only raw JSON output without any commentary.
        """

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            json=payload,
            headers={"Content-Type": "application/json"},
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
                    raise Exception(
                        "Failed to extract valid JSON from the response."
                    ) from e
            else:
                raise Exception("No candidates found in response.")
        else:
            raise Exception("Failed to get wireframe with Gemini API.")

        return wireframe_components

    def validateJsonResponse(self, json_str):
        match = re.search(r"```json\n(.*?)\n```", json_str, re.DOTALL)
        if match:
            json_str = match.group(1)
            parsed_json = json.loads(json_str)  # To validate JSON
            return parsed_json
        else:
            print("No JSON found")

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.wireframe_components = self.getWireframeComponents()
        return self.wireframe_components
