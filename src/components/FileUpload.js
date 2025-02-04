import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');

  // Set the workerSrc to the location of the pdf worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

  // Function to handle file upload and extract text
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to extract text from PDF using pdf.js
  const extractTextFromPDF = async (pdfData) => {
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';
    const numPages = pdf.numPages;
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      text += textContent.items.map(item => item.str).join(' ');
    }
    return text;
  };

  // Function to extract text from DOCX using mammoth.js
  const extractTextFromDOCX = async (docxData) => {
    const result = await mammoth.extractRawText({ arrayBuffer: docxData });
    return result.value;
  };

  // Function to handle file upload and send extracted text to backend
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

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

        // Send the extracted text to the backend for summarization
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error: ' + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>Upload Document for Text Extraction and Summarization</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Analyze</button>
      <div>
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default FileUpload;
