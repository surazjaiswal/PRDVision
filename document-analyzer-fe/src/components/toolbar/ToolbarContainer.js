import React, { useState, useRef, useEffect } from "react";
import { Plus, Minus, Share2, Download, ChevronDown } from "lucide-react";
import "./ToolbarContainer.css";
import ZoomInIcon from "../../assets/ic_zoom_in.svg";
import ZoomOutIcon from "../../assets/ic_zoom_out.svg";

const Toolbar = ({
  onSelectOption,
  availableKeys,
  zoomIn,
  zoomOut,
  zoomPercentage,
  showZoomControls,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(availableKeys[0]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    onSelectOption(option);
  };

  return (
    <div className="toolbar-container">
      <div class="toolbar-element">
        <button className="grid-button">
          <div className="grid-icon">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </button>

        <div className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedOption} <ChevronDown className="icon" />
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              {availableKeys.map((key) => (
                <li
                  key={key}
                  className="dropdown-item"
                  onClick={() => handleOptionSelect(key)}
                >
                  {key}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showZoomControls && (
        <div class="zoom-controllers">
          <button
            onClick={zoomOut}
            className="zoom-btn"
            disabled={zoomPercentage <= 40}
          >
            <img src={ZoomOutIcon} alt="Zoom Out" className="zoom-icon" />
          </button>

          <span className="zoom-counter">{zoomPercentage}%</span>

          <button
            onClick={zoomIn}
            className="zoom-btn"
            disabled={zoomPercentage >= 200}
          >
            <img src={ZoomInIcon} alt="Zoom In" className="zoom-icon" />
          </button>
          <button className="share-button hidden">
            <Share2 className="icon" /> Share
          </button>
          <button className="export-button hidden">
            <Download className="icon" /> Export
          </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
