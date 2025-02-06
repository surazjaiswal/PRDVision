import React, { useState } from 'react';
import UploadIcon from '../../assets/ic_upload_icon.svg';
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
          {mermaidChart ? <MermaidRenderer chartDefinition={mermaidChart} /> : <p>No Mermaid diagram available</p>}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;

// import React, { useState } from 'react';
// import axios from 'axios';
// import * as pdfjsLib from 'pdfjs-dist';
// import mammoth from 'mammoth';
// import Flowchart from './FlowChart'; // Existing component
// import MindMap from './MindMap'; // Existing component
// import MermaidRenderer from './MermaidRenderer'; // New component for Mermaid.js rendering

// // Set the pdf.js worker source
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [extractedText, setExtractedText] = useState('');
//   const [flowchartData, setFlowchartData] = useState(null);
//   const [mindMapData, setMindMapData] = useState(null);
//   const [mermaidChart, setMermaidChart] = useState(''); // New state for Mermaid.js
//   const [loading, setLoading] = useState(false);

//   Handle file selection
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Extract text from PDF using pdf.js
//   const extractTextFromPDF = async (pdfData) => {
//     console.log("Extracting text from PDF...");
//     const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
//     let text = '';
//     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//       const page = await pdf.getPage(pageNum);
//       const textContent = await page.getTextContent();
//       text += textContent.items.map(item => item.str).join(' ');
//     }
//     console.log("Extracted PDF Text:", text);
//     return text;
//   };

//   // Extract text from DOCX using mammoth.js
//   const extractTextFromDOCX = async (docxData) => {
//     console.log("Extracting text from DOCX...");
//     const result = await mammoth.extractRawText({ arrayBuffer: docxData });
//     console.log("Extracted DOCX Text:", result.value);
//     return result.value;
//   };

//   // Handle file upload and extract text at the frontend
//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first.');
//       return;
//     }

//     setLoading(true);
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       const fileData = e.target.result;
//       let text = '';

//       try {
//         if (file.name.endsWith('.pdf')) {
//           text = await extractTextFromPDF(fileData);
//         } else if (file.name.endsWith('.docx')) {
//           text = await extractTextFromDOCX(fileData);
//         } else if (file.name.endsWith('.txt')) {
//           text = e.target.result;
//         } else {
//           alert('Unsupported file type');
//           return;
//         }

//         setExtractedText(text);
//         analyzeText(text); // Send extracted text to backend for analysis
//       } catch (error) {
//         console.error('Error extracting text:', error);
//         alert('Error extracting text');
//       }
//     };

//     if (file.name.endsWith('.txt')) {
//       reader.readAsText(file);
//     } else {
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   // Send extracted text to backend for flowchart, mind map, and Mermaid.js
  // const analyzeText = async (text) => {
  //   console.log("Sending extracted text to backend...", text);

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8000/analyze',
  //       { text },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json, text/plain, */*'
  //         },
  //       }
  //     );

  //     console.log("Response from backend:", response.data);
  //     setFlowchartData(response.data.flowchart);
  //     setMindMapData(response.data.mindMapData);
  //     setMermaidChart(response.data.mermaid); // Set the Mermaid.js response
  //   } catch (error) {
  //     console.error("Error analyzing text:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   return (
//     <div>
//       <h2>Upload Document for Analysis</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Extract & Analyze</button>

//       {loading && <p>Loading...</p>}

//       {extractedText && (
//         <div>
//           <h3>Extracted Text</h3>
//           <textarea value={extractedText} readOnly rows={10} cols={50}></textarea>
//         </div>
//       )}

//       {flowchartData ? <Flowchart flowchartData={flowchartData} /> : <p>No flowchart data available</p>}
//       {mindMapData ? <MindMap mindMapData={mindMapData} /> : <p>No mind map data available</p>}
      // {mermaidChart ? <MermaidRenderer chartDefinition={mermaidChart} /> : <p>No Mermaid diagram available</p>}
//     </div>
//   );
// };

// export default FileUpload;
