import React, { useState } from 'react';
import UploadIcon from '../../assets/ic_upload_icon.svg';
import MermaidBgIcon from '../../assets/ic_mermaid_container_bg.png';
import './FileUpload.css';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import MermaidRenderer from '../mermaid/MermaidRenderer'; // New component for Mermaid.js rendering

// Set the pdf.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // Optional, if you want to show loading state
  const [mermaidChart, setMermaidChart] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file.name);
      const pdfData = await readPDF(file);
      const extractedText = await extractTextFromPDF(pdfData);
      await analyzeText(extractedText);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  // Read the PDF file as a binary string
  const readPDF = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        resolve(e.target.result); // Return the file as a binary string
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
  };

  // Extract text from PDF using pdfjs-dist
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

  // Send the extracted text to the backend API
  const analyzeText = async (text) => {
    console.log("Sending extracted text to backend...", text);
    setLoading(true); // Show loading state

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/analyze', // Your API endpoint
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log("Response from backend:", response.data);
      setMermaidChart(response.data.mermaid);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container">
      <div className="file-upload">
        <div className="upload-icon-container">
          <img src={UploadIcon} alt="UploadIcon" className="upload-icon" />
          <p className="upload-text">Drop your PRD PDF here</p>
          <p className="upload-text-message">or click to browse</p>
          <label className="upload-button">
            Choose File
            <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
          </label>
        </div>
        {selectedFile && <p className="file-name">{selectedFile}</p>}
        {loading && <p>Loading...</p>} {/* Optional loading message */}
      </div>

      <div className="mermaid-chart">
        <h2 className="mind-map-heading">MindMap</h2>
        <div className="mind-map-container">
          {mermaidChart ? <MermaidRenderer chartDefinition={mermaidChart} /> : <img src={MermaidBgIcon} alt="MermaidBgIcon"/>}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;