import requests
import re

OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"

class PRDSummarizer:
    def __init__(self, prd_text):
        self.prd_text = prd_text
        self.summarized_text = ""
        self.user_flow_text = ""
        self.user_flows = []
        self.ui_components = []

    def summarize_text(self):
        prompt = f"""
        You are an expert in summarizing Product Requirements Documents (PRDs). Your task is to generate a concise and comprehensive summary of the provided PRD text. The summary should capture the key points, objectives, features, and requirements outlined in the document. Ensure the summary is well-structured, easy to understand, and does not exceed 5000 characters.

        **Guidelines for the Summary:**
        1. Focus on the main purpose and goals of the product.
        2. Highlight the key features and functionalities.
        3. Include any critical technical or business requirements.
        4. Mention any constraints, assumptions, or dependencies.
        5. Avoid unnecessary details, examples, or repetitions.
        6. Ensure the summary is coherent and flows logically.

        **PRD Text to Summarize:**
        {self.prd_text}
        """
        
        payload = {
            "model": "deepseek-coder-v2",
            "prompt": prompt,
            "stream": False
        }
        response = requests.post(OLLAMA_API_URL, json=payload)
        # print("summarize_text response:", response.json())

        if response.status_code == 200:
            summary_response = response.json().get("response", "")
            # summary_start_index = summary_response.find('</think>') + len('</think>')
            self.summarized_text = summary_response.strip()
            # print("Summarized Text:", self.summarized_text)
        else:
            raise Exception("Failed to summarize text with DeepSeek.")

    def extract_user_flows(self):
        prompt = f"""
        You are an AI expert in product analysis and user experience design. Given a Product Requirement Document (PRD), your task is to extract and map the complete user flow. Identify key steps, decision points, and interactions a user takes while engaging with the product. Structure the user flow in a clear, step-by-step manner, including entry points, actions, transitions, and outcomes. If applicable, highlight alternative paths, edge cases, and dependencies. Present the result in an easy-to-understand format, such as a flowchart-style list or structured diagram description.

        PRD Text to for User Flow Extraction:
        {self.summarized_text}
        """

        payload = {
            "model": "deepseek-coder-v2",
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(OLLAMA_API_URL, json=payload)
        # print("extract_user_flows response:", response.json())

        if response.status_code == 200:
            user_flow_response = response.json().get("response", "")
            # user_flow_start_index = user_flow_response.find('</think>') + len('</think>')
            self.user_flow_text = user_flow_response.strip()
            # print("User flow:", self.user_flow_text)
        else:
            raise Exception("Failed to summarize user flow with DeepSeek.")

    def extract_ui_components(self):
        prompt = f"""
        You are an AI expert in product analysis and user experience design. Given a Product Requirement Document (PRD), your task is to extract and map the complete user flow. Identify key steps, decision points, and interactions a user takes while engaging with the product. Structure the user flow in a clear, step-by-step manner, including entry points, actions, transitions, and outcomes. If applicable, highlight alternative paths, edge cases, and dependencies. Present the result in an easy-to-understand format, such as a flowchart-style list or structured diagram description.

        PRD Text to for User Flow Extraction:
        {self.prd_text}
        """
        """Extract UI components needed for the user flows."""
        # Assuming UI components are mentioned in the summarized text
        ui_keywords = ["button", "input", "dropdown", "text field", "checkbox", "slider", "modal"]
        ui_components = []

        for keyword in ui_keywords:
            if keyword in self.summarized_text.lower():
                ui_components.append(keyword)

        self.ui_components = ui_components

    def generate_mermaid_code(self):
        """Generate Mermaid code based on the user flows."""

        prompt = f"""
        You are an AI expert in workflow visualization and Mermaid.js. Your task is to generate valid and error-free Mermaid.js code based on the given user flow from a Product Requirement Document (PRD). The output must not contain any syntax errors or comments.

        Ensure the following:

        Use correct Mermaid flowchart syntax (graph TD or graph LR).
        Validate all syntax to prevent errors.
        Represent decision points with ? and conditional branches (yes/no).
        Use subgraphs if the flow contains modular steps.
        Accurately capture loops, conditions, and alternate paths.
        No comments should be included in the output.
        Return only the Mermaid.js code, without any additional explanation.
        User Flow to Convert:
        {self.user_flow_text}
        """

        payload = {
            "model": "deepseek-coder-v2",
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(OLLAMA_API_URL, json=payload)
        # print("extract_user_flows response:", response.json())

        if response.status_code == 200:
            mermaid_prompt_response = response.json().get("response", "")
            match = re.search(r"```mermaid\n(.*?)\n```", mermaid_prompt_response, re.DOTALL)
            
            if match:
                mermaid_code = match.group(1).strip()
                # print("Mermaid Code:", mermaid_code)
            else:
                raise Exception("Mermaid.js code not found in response.")
        else:
            raise Exception("Failed to summarize user flow with DeepSeek.")
        
        return mermaid_code

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.summarize_text()
        self.extract_user_flows()
        self.extract_ui_components()
        mermaid_code = self.generate_mermaid_code()
        
        return {
            "summarized_text": self.summarized_text,
            "user_flows": self.user_flows,
            "ui_components": self.ui_components,
            "mermaid_code": mermaid_code
        }
