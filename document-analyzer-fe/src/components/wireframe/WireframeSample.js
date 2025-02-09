import React, { useState } from "react";
import WireframeRenderer from "./Wireframe";

const sampleJson = {
    "screens": [
      {
        "name": "Login Screen",
        "components": [
          { "type": "TextField", "label": "Username or Email" },
          { "type": "TextField", "label": "Password" },
          { "type": "Checkbox", "label": "Remember Me" },
          { "type": "Button", "label": "Login" },
          { "type": "Link", "label": "Forgot Password?" },
          { "type": "Link", "label": "Sign Up" }
        ]
      },
      {
        "name": "Feed Screen",
        "components": [
          { "type": "Navbar", "items": ["Home", "Search", "Notifications", "Profile"] },
          { "type": "Post", "author": "User1", "content": "This is a sample post", "media": false },
          { "type": "Post", "author": "User2", "content": "Another post with an image", "media": true },
          { "type": "Button", "label": "Create Post" }
        ]
      },
      {
        "name": "Media Screen",
        "components": [
          { "type": "Title", "text": "Media Gallery" },
          { "type": "Grid", "items": [
            { "type": "Image", "src": "image1.jpg" },
            { "type": "Image", "src": "image2.jpg" },
            { "type": "Video", "src": "video1.mp4" }
          ] },
          { "type": "Button", "label": "Upload Media" }
        ]
      },
      {
        "name": "Poll Screen",
        "components": [
          { "type": "Title", "text": "Create a Poll" },
          { "type": "TextField", "label": "Poll Question" },
          { "type": "TextField", "label": "Option 1" },
          { "type": "TextField", "label": "Option 2" },
          { "type": "TextField", "label": "Option 3" },
          { "type": "Button", "label": "Submit Poll" },
          { "type": "List", "items": ["Active Polls", "Past Polls"] }
        ]
      }
    ]
  };
  
  const WireframeAppSample = () => {
    const [wireframeData, setWireframeData] = useState(sampleJson);
  
    return (
      <div>
        <h2>Wireframe Generator</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {wireframeData.screens.map((screen) => (
            <div key={screen.name} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <h3>{screen.name}</h3>
              <WireframeRenderer wireframeData={{ screens: [screen] }} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WireframeAppSample;
  