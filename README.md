# PRDVision

**Transforming PRDs into Wireframes**

## Overview

PRDVision is an AI-powered tool that automates the process of converting Product Requirement Documents (PRDs) into structured wireframes, flowcharts (mind maps), and summarized text. By leveraging **GEMINI AI**, PRDVision simplifies the design and development workflow, reducing time, errors, and miscommunication between teams.

The project is built using:

- **Frontend:** React
- **Backend:** Flask
- **AI Model:** GEMINI

## Features

- **Automated Flowchart Generation**: Converts PRD into structured flow diagrams for easy visualization.
- **Summarized Text**: Extracts key information from PRD documents to provide concise summaries.
- **Wireframe Diagram Creation**: Generates wireframes based on PRD content, aiding product teams and designers.
- **Supports Multiple Formats**: Accepts **PDF, DOCX, TXT** files as input.
- **Future Enhancements**:
  - Editable and exportable flowcharts.
  - Interactive wireframes with clickable prototypes.
  - AI-driven UI component suggestions.

## Who Benefits?

- **Product Teams**: Quickly validate ideas and iterate faster.
- **Designers**: Automate initial wireframe creation, allowing more focus on UX/UI refinement.
- **Developers**: Obtain clear, structured design specifications.
- **Businesses**: Accelerate product development, leading to faster time-to-market.

## System Workflow

1. **Document Input** - Upload PRD in **PDF, DOCX, or TXT** format.
2. **AI Analysis** - Extracts relevant information.
3. **Output Generation** - Produces a **Flowchart, Summary, and Wireframe**.

## Installation & Setup

### Setting Up GEMINI API Key
To run GEMINI AI, you need to set the `GEMINI_API_KEY` as an environment variable in Python.

#### Steps:
- On **Windows**:
  ```powershell
  set GEMINI_API_KEY=your_api_key_here
  ```
- On **Mac/Linux**:
  ```bash
  export GEMINI_API_KEY=your_api_key_here
  ```

Ensure this key is correctly set before running the backend.

Follow these steps to set up PRDVision locally.

### Prerequisites

Ensure you have the following installed:

- **Python 3.8+**
- **Node.js 16+**
- **Flask** (for the backend)
- **React** (for the frontend)

### Backend Setup (Flask)

```bash
# Clone the repository
git clone https://github.com/surazjaiswal/PRDVision.git

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend should now be running at `http://localhost:5000`

### Frontend Setup (React)

```bash
cd document-analyzer-fe/

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend should now be running at `http://localhost:3000`

## Usage

1. Open the web application.
2. Upload a PRD document (**PDF, DOCX, or TXT**).
3. Click "Generate" to receive the **Flowchart, Summary, and Wireframe**.
4. Download or refine the generated outputs as needed.

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make necessary improvements.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or collaborations, feel free to reach out to:

- **Shubham Gupta**
- **Suraj Jaiswal**
