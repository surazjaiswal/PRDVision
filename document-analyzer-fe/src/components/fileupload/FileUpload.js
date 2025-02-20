import React, { useState, useRef, useEffect } from "react";
import UploadIcon from "../../assets/ic_upload_icon.svg";
import MermaidBgIcon from "../../assets/ic_mermaid_container_bg.png";
import "./FileUpload.css";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import MermaidRenderer from "./MermaidRenderer";
import mammoth from "mammoth";
import WireframeRenderer from "../wireframe/Wireframe";
import SummaryView from "../summary/SummaryView";
import Toolbar from "../toolbar/ToolbarContainer";
import ReactFlowRenderer from "../wireframe/ReactFlowRenderer";

// Set the pdf.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mermaidChart, setMermaidChart] = useState("");
  const [wireframeScreens, setWireframeScreens] = useState("");
  const [availableKeys, setAvailableKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [savedResponse, setSavedResponse] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [isResponseReceived, setIsResponseReceived] = useState(false);
  const zoomRef = useRef(null);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const zoomLevel = useRef(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [showZoomControls, setZoomControls] = useState(true);
  const [showZoomIcons, setZoomIcons] = useState(true);

  useEffect(() => {
    setIsSummaryView(selectedKey === "summarizedText");
    if (selectedKey !== "Flowchart") {
      // Reset zoom when switching to other views
      if (zoomRef.current) {
        zoomRef.current.style.transform = "scale(1)";
      }
    }
  }, [selectedKey]);

  const handleFileChange = async () => {
    if (!selectedFile) {
      alert("Please select a valid document first.");
      return;
    }

    let extractedText = "";
    setLoading(true);
    setIsResponseReceived(false); // Reset response state

    try {
      if (selectedFile.type === "application/pdf") {
        extractedText = await extractTextFromPDF(await readPDF(selectedFile));
      } else if (selectedFile.type === "text/plain") {
        extractedText = await extractTextFromTXT(selectedFile);
      } else if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractedText = await extractTextFromDOCX(selectedFile);
      } else {
        alert(
          "Unsupported file format. Please upload a PDF, TXT, or DOCX file."
        );
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
    let text = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      text += textContent.items.map((item) => item.str).join(" ");
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
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target.result,
          });
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
    return text
      .replace(/•|●|▪|◦|‣|★|☆/g, "")
      .replace(/[^\w\s.,!?]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const analyzeText = async (text) => {
    console.log("Sending cleaned text to backend...", text);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Response from backend:", response.data);

      const resData = response.data;
      setSavedResponse(resData);
      setAvailableKeys(Object.keys(resData));
      setSelectedKey(Object.keys(resData)[0]);
      setMermaidChart(Object.values(resData)[0]);
      setWireframeScreens(Object.values(resData)[0]);
      setIsResponseReceived(true);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeySelection = (newKey) => {
    setSelectedKey(newKey);
    setZoomControls(true);
    setZoomIcons(false)
    console.log(newKey)
    if (newKey === "Flowchart") {
      setZoomIcons(true)
    } else {
      setZoomIcons(false)
      if (zoomRef.current) {
        zoomRef.current.style.transform = "scale(1)";
        setZoomPercentage(100); // Reset zoom percentage as well
        zoomLevel.current = 1; // Reset zoom level to 1
        centerContent();
      }
    }
    if (newKey === "summarizedText") {
      setIsSummaryView(true);
      setSummaryText(savedResponse["summarizedText"]);
      setZoomControls(false);
    } else if (newKey === "wireframes") {
      setIsSummaryView(false);
      setWireframeScreens(savedResponse["wireframes"]);
    } else {
      setIsSummaryView(false);
      setMermaidChart(savedResponse[newKey]);
    }
  };

  const zoomIn = () => {
    if (zoomRef.current && zoomPercentage < 200) {
      zoomLevel.current = Math.min(zoomLevel.current + 0.2, 2);
      zoomRef.current.style.transform = `scale(${zoomLevel.current})`;
      setZoomPercentage(Math.min(200, zoomPercentage + 20));
      centerContent();
    }
  };

  const zoomOut = () => {
    if (zoomRef.current && zoomPercentage > 40) {
      zoomLevel.current = Math.max(zoomLevel.current - 0.2, 0.4);
      zoomRef.current.style.transform = `scale(${zoomLevel.current})`;
      setZoomPercentage(Math.max(40, zoomPercentage - 20));
      centerContent();
    }
  };

  const centerContent = () => {
    if (zoomRef.current) {
      const element = zoomRef.current;
      const contentWidth = element.scrollWidth;
      const contentHeight = element.scrollHeight;
      const containerWidth = element.offsetWidth;
      const containerHeight = element.offsetHeight;

      element.scrollLeft = (contentWidth - containerWidth) / 2;
      element.scrollTop = (contentHeight - containerHeight) / 2;
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only allow left-click dragging

    setIsDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY);
    setScrollLeft(zoomRef.current.scrollLeft);
    setScrollTop(zoomRef.current.scrollTop);

    zoomRef.current.style.cursor = "grabbing";
    e.preventDefault(); // Prevent text selection while dragging
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    requestAnimationFrame(() => {
      const dx = e.pageX - startX;
      const dy = e.pageY - startY;

      zoomRef.current.scrollLeft = scrollLeft - dx;
      zoomRef.current.scrollTop = scrollTop - dy;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    zoomRef.current.style.cursor = "grab";
  };

  // Add event listeners for mouse movement
  useEffect(() => {
    setIsSummaryView(selectedKey === "summarizedText");
    if (selectedKey !== "Flowchart") {
      // Reset zoom when switching to other views
      if (zoomRef.current) {
        zoomRef.current.style.transform = "scale(1)";
        setZoomPercentage(100); // Reset zoom percentage as well
        zoomLevel.current = 1; // Reset zoom level to 1
      }
    }

    if (zoomRef.current) {
      centerContent();
    }
  }, [selectedKey, mermaidChart]);

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
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                hidden
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>

            <button
              className="generate-button"
              onClick={handleFileChange}
              disabled={!selectedFile}
            >
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
          <div className="toolbar-element-container">
            <Toolbar
              onSelectOption={handleKeySelection}
              availableKeys={availableKeys}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              zoomPercentage={zoomPercentage}
              showZoomControls={showZoomControls}
              showZoomIcons={showZoomIcons}
            />
          </div>
        )}

        <div
          className={`mind-map-container ${
            selectedKey === "wireframes" ? "disable-flex" : ""
          }`}
        >
          {selectedKey === "wireframes" && wireframeScreens?.screens ? (
            <div>
              <div>
                <div>
                  <ReactFlowRenderer
                    wireframeData={{ screens: wireframeScreens }}
                  />
                </div>
              </div>
            </div>
          ) : // Default Mind Map / Summary View
          loading ? (
            <div class="loader"></div>
          ) : isSummaryView ? (
            <SummaryView summaryText={summaryText} />
          ) : (
            <div
              className="mermaid-wrapper"
              ref={zoomRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {mermaidChart ? (
                <MermaidRenderer chartDefinition={mermaidChart} />
              ) : (
                <img src={MermaidBgIcon} alt="MermaidBgIcon" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
