import React from "react";
import "./UIComponent.css"

const UIComponent = ({ data = {} }) => {
  switch (data.type) {
    case "TextField":
      return <input className="textfield" placeholder={data?.label || "Enter text"} />;

    case "Button":
      return <div className="button">{data?.label || "Button"}</div>;

    case "Switch":
      return (
        <div className="switch">
          <span>{data?.label || "Switch"}</span>
          <input type="checkbox" />
        </div>
      );

    case "Dropdown":
      return (
        <select className="dropdown">
          {(data?.options || []).map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      );

    case "ImageView":
      return <div className="image-placeholder">Image</div>;

    case "VideoView":
      return <div className="image-placeholder">Video</div>;

    case "Avatar":
      return (
        <img
          src={data?.src || "https://via.placeholder.com/50"}
          alt="Avatar"
          className="avatar"
        />
      );

    case "Progress":
      return (
        <div className="progress-bar">
          <div
            style={{ width: `${data?.progress || 0}%` }}
            className="progress-fill"
          ></div>
        </div>
      );

    case "Slider":
      return (
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={data?.value || 0}
          className="slider"
        />
      );

    case "Tabs":
      return (
        <div className="tabs">
          {(data?.tabs || []).map((tab, index) => (
            <div key={index} className="tab">
              {tab}
            </div>
          ))}
        </div>
      );

    default:
      return <div className="component-placeholder">{data?.label || "Component"}</div>;
  }
};

export default UIComponent;
