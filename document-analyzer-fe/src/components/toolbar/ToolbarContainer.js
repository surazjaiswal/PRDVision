import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Share2, Download, ChevronDown } from "lucide-react";
import './ToolbarContainer.css'

const Toolbar = ({ onSelectOption, availableKeys }) => {
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
            <div></div><div></div><div></div><div></div>
            </div>
        </button>
        <div className="dropdown-container">
            <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {selectedOption} <ChevronDown className="icon" />
            </button>
            {isDropdownOpen && (
            <ul className="dropdown-menu">
                {availableKeys.map((key) => (
                  <li key={key} className="dropdown-item" onClick={() => handleOptionSelect(key)}>
                    {key}
                  </li>
                ))}
            </ul>
            )}
        </div>

      </div>

      <div class="toolbar-element">
        <button className="share-button">
            <Share2 className="icon" /> Share
        </button>
        <button className="export-button">
            <Download className="icon" /> Export
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
