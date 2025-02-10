import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Share2, Download, ChevronDown } from "lucide-react";
import './ToolbarContainer.css'

const Toolbar = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Hierarchical");
    const options = ["Hierarchical", "Grid", "List"];


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
                {options.map((option) => (
                <li key={option} className="dropdown-item" onClick={() => { setSelectedOption(option); setIsDropdownOpen(false); }}>
                    {option}
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
