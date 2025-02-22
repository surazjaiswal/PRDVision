import requests
import re


class PRDSummarizer:
    def __init__(self, api_key, prd_text):
        self.prd_text = prd_text
        self.summarized_text = ""
        self.user_flow_text = ""
        self.ui_components = []
        self.api_key = api_key
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    def summarize_text(self):
        prompt = f"""
        You are an expert in summarizing Product Requirements Documents (PRDs). Your task is to generate a concise, structured, and comprehensive summary of the provided PRD text. The summary should be well-organized, easy to understand, and formatted for readability. Ensure it captures key points, objectives, features, and requirements within a 5000-character limit.

        **Summary Format:**
        🔹 **Overview:** Briefly describe the product, its purpose, and target users.  
        🔹 **Key Features:** List core functionalities using bullet points with checkmarks (✅).  
        🔹 **Core UI Components:** Highlight essential UI elements using pin icons (📌).  
        🔹 **System Architecture:** Outline key technologies, databases, and frameworks used, formatted with bullets (🔹).  
        🔹 **Future Enhancements:** Mention planned upgrades with rocket icons (🚀).  

        **Guidelines:**
        1. Focus on the main purpose and goals of the product.  
        2. Highlight key features and functionalities concisely.  
        3. Mention critical technical or business requirements.  
        4. Include constraints, assumptions, or dependencies if relevant.  
        5. Avoid unnecessary details, examples, or repetitions.  
        6. Ensure logical flow and structured formatting.  

        **PRD Text to Summarize:**  
        {self.prd_text}
        """

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            json=payload,
            headers={"Content-Type": "application/json"},
        )

        print("\n\nSummarize text response - ", response.json())

        if response.status_code == 200:
            candidates = response.json().get("candidates", [])
            summary_response = candidates[0]["content"]["parts"][0]["text"]
            self.summarized_text = summary_response.strip()
        else:
            raise Exception("Failed to summarize text")

    def extract_user_flows(self):
        prompt = f"""
        You are an AI expert in product analysis and user experience design. Given a Product Requirement Document (PRD), your task is to extract and map the complete user flow. Identify key steps, decision points, and interactions a user takes while engaging with the product. Structure the user flow in a clear, step-by-step manner, including entry points, actions, transitions, and outcomes. If applicable, highlight alternative paths, edge cases, and dependencies. Present the result in an easy-to-understand format, such as a flowchart-style list or structured diagram description.

        PRD Text to for User Flow Extraction:
        {self.summarized_text}
        """

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            json=payload,
            headers={"Content-Type": "application/json"},
        )
        print("\n\nUser flow response - ", response.json())

        if response.status_code == 200:
            candidates = response.json().get("candidates", [])
            user_flow_response = candidates[0]["content"]["parts"][0]["text"]
            self.user_flow_text = user_flow_response.strip()
        else:
            raise Exception("Failed to summarize user flow.")

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
        {self.prd_text}
        """

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            json=payload,
            headers={"Content-Type": "application/json"},
        )
        print("\n\nMermaid response - ", response.json())

        if response.status_code == 200:
            candidates = response.json().get("candidates", [])
            mermaid_code = candidates[0]["content"]["parts"][0]["text"]
            # Extracting the graph definition using regex
            match = re.search(r"```mermaid\n(.*?)\n```", mermaid_code, re.DOTALL)
            if match:
                mermaid_graph = match.group(1)
            else:
                # If the mermaid code is not wrapped in markdown format, assume the entire text is the graph
                mermaid_graph = mermaid_code.strip()
                print("\n\nMermaid graph:", mermaid_graph)
        else:
            raise Exception("Failed to get mermaid code.")

        return mermaid_graph

    def process(self):
        """Process the PRD text and return the summarized information."""
        self.summarize_text()
        self.extract_user_flows()
        mermaid_code = self.generate_mermaid_code()

        return {
            "summarized_text": self.summarized_text,
            "user_flows": self.user_flow_text,
            "mermaid_code": mermaid_code,
        }
