import React, { useState } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Flowchart from './FlowChart'; // Ensure this component exists
import MindMap from './MindMap'; // Ensure this component exists

// Set the pdf.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [flowchartData, setFlowchartData] = useState(null);
  const [mindMapData, setMindMapData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Extract text from PDF using pdf.js
  const extractTextFromPDF = async (pdfData) => {
    console.log("Extracting text from PDF...");
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      text += textContent.items.map(item => item.str).join(' ');
    }
    console.log("Extracted PDF Text:", text);
    return text;
  };

  // Extract text from DOCX using mammoth.js
  const extractTextFromDOCX = async (docxData) => {
    console.log("Extracting text from DOCX...");
    const result = await mammoth.extractRawText({ arrayBuffer: docxData });
    console.log("Extracted DOCX Text:", result.value);
    return result.value;
  };

  // Handle file upload and extract text at the frontend
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileData = e.target.result;
      let text = '';

      try {
        if (file.name.endsWith('.pdf')) {
          text = await extractTextFromPDF(fileData);
        } else if (file.name.endsWith('.docx')) {
          text = await extractTextFromDOCX(fileData);
        } else if (file.name.endsWith('.txt')) {
          text = e.target.result;
        } else {
          alert('Unsupported file type');
          return;
        }

        setExtractedText(text);
        analyzeText(text); // Send extracted text to backend for analysis
      } catch (error) {
        console.error('Error extracting text:', error);
        alert('Error extracting text');
      }
    };

    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Send extracted text to backend for flowchart and mind map generation
  const analyzeText = async (text) => {
    console.log("Sending extracted text to backend...", text);

    try {
      const response = await axios.post(
        'http://localhost:8000/analyze',
        { text },  // Ensure payload is correctly formatted
        {
          headers: {
            'Content-Type': 'application/json',  // Explicitly set content type
            'Accept': 'application/json, text/plain, */*'
          },
        }
      );

      console.log("Response from backend:", response.data);
      setFlowchartData(response.data.flowchart);
      setMindMapData(response.data.mindMapData);
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
  };

  return (
    <div>
      <h2>Upload Document for Analysis</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Extract & Analyze</button>

      {loading && <p>Loading...</p>}

      {extractedText && (
        <div>
          <h3>Extracted Text</h3>
          <textarea value={extractedText} readOnly rows={10} cols={50}></textarea>
        </div>
      )}

      {flowchartData ? <Flowchart flowchartData={flowchartData} /> : <p>No flowchart data available</p>}
      {mindMapData ? <MindMap mindMapData={mindMapData} /> : <p>No mind map data available</p>}
    </div>
  );
};

export default FileUpload;
