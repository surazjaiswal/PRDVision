import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from '../../assets/ic_upload_icon.svg';
import MermaidBgIcon from '../../assets/ic_mermaid_container_bg.png';
import './FileUpload.css';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import MermaidRenderer from '../mermaid/MermaidRenderer';
import mammoth from 'mammoth';

// Set the pdf.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mermaidChart, setMermaidChart] = useState('');
  const [availableKeys, setAvailableKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [savedResponse, setSavedResponse] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [isResponseReceived, setIsResponseReceived] = useState(false);
  const zoomRef = useRef(null);
  const zoomLevel = useRef(1);

  useEffect(() => {
    setIsSummaryView(selectedKey === 'summarizedText');
  }, [selectedKey]);

  const handleFileChange = async () => {
    if (!selectedFile) {
      alert("Please select a valid document first.");
      return;
    }

    let extractedText = '';
    setLoading(true);
    setIsResponseReceived(false); // Reset response state

    try {
      if (selectedFile.type === "application/pdf") {
        extractedText = await extractTextFromPDF(await readPDF(selectedFile));
      } else if (selectedFile.type === "text/plain") {
        extractedText = await extractTextFromTXT(selectedFile);
      } else if (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        extractedText = await extractTextFromDOCX(selectedFile);
      } else {
        alert("Unsupported file format. Please upload a PDF, TXT, or DOCX file.");
        return;
      }

      const cleanedText = preprocessText(extractedText);
      await analyzeText(cleanedText);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setLoading(false);
    }
  };

  const readPDF = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromPDF = async (pdfData) => {
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      text += textContent.items.map(item => item.str).join(' ');
    }
    return text;
  };

  const extractTextFromTXT = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const extractTextFromDOCX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const preprocessText = (text) => {
    return text.replace(/•|●|▪|◦|‣|★|☆/g, '')
      .replace(/[^\w\s.,!?]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const analyzeText = async (text) => {
    console.log("Sending cleaned text to backend...", text);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze', { text }, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });

      console.log("Response from backend:", response.data);

      const resData = response.data;
      setSavedResponse(resData);
      setAvailableKeys(Object.keys(resData));
      setSelectedKey(Object.keys(resData)[0]);
      setMermaidChart(Object.values(resData)[0]);
      setIsResponseReceived(true);

    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeySelection = (event) => {
    const newKey = event.target.value;
    setSelectedKey(newKey);

    if (newKey === 'summarizedText') {
      setIsSummaryView(true);
      setSummaryText(savedResponse["summarizedText"]);
    } else {
      setIsSummaryView(false);
      setMermaidChart(savedResponse[newKey]);
    }
  };

  const zoomIn = () => {
    if (zoomRef.current) {
      zoomLevel.current += 0.2;
      zoomRef.current.style.transform = `scale(${zoomLevel.current})`;
    }
  };

  const zoomOut = () => {
    if (zoomRef.current) {
      zoomLevel.current = Math.max(0.5, zoomLevel.current - 0.2);
      zoomRef.current.style.transform = `scale(${zoomLevel.current})`;
    }
  };

  return (
    <div className="container">
      <div className="file-upload">
        <div className="upload-icon-container">
          <img src={UploadIcon} alt="UploadIcon" className="upload-icon" />
          <p className="upload-text">Drop your PRD document here</p>
          <p className="upload-text-message">or click to browse</p>

          <div className="upload-controls">
            <label className="upload-button">
              Choose File
              <input type="file" accept=".pdf,.txt,.docx" hidden onChange={(e) => setSelectedFile(e.target.files[0])} />
            </label>

            <button className="generate-button" onClick={handleFileChange} disabled={!selectedFile}>
              Generate
            </button>
          </div>
        </div>

        {selectedFile && <p className="file-name">{selectedFile.name}</p>}
        {loading && <p className="loading-message">Processing document...</p>}
      </div>

      <div className="mermaid-chart">
        {!isResponseReceived ? (
          <p className="default-message">Waiting for analysis...</p>
        ) : (
          <div className="dropdown-container">
            <select id="keySelector" value={selectedKey} onChange={handleKeySelection} className="custom-dropdown">
              {availableKeys.map((key, index) => (
                <option key={index} value={key}>{key}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mind-map-container">
        {loading ? (
            <div className="loader">Loading...</div>
          ) : isSummaryView ? (
            <div className="summary-view">
              <h3>Summarized Text</h3>
              <p>{summaryText}</p>
            </div>
          ) : (
            <div className="mermaid-wrapper" ref={zoomRef}>
              {mermaidChart ? (
                <MermaidRenderer chartDefinition={mermaidChart} />
              ) : (
                <img src={MermaidBgIcon} alt="MermaidBgIcon" />
              )}
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="zoom-controls">
            <button onClick={zoomIn} className="zoom-btn">+</button>
            <button onClick={zoomOut} className="zoom-btn">-</button>
          </div>
      </div>
    </div>
  );
}

export default FileUpload;