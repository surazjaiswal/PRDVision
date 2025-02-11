import React, { useState } from "react";
import WireframeRenderer from "./WireframeNew";
import UIComponentRenderer from "./KonvaRenderer";

const sampleJson = {
  "screens": [
    {
      "name": "Login Screen",
      "components": [
        { "type": "TextField", "label": "Username" },
        { "type": "TextField", "label": "Password" },
        { "type": "Button", "label": "Login" },
        { "type": "Button", "label": "Forgot Password?" }
      ]
    },
    {
      "name": "Profile Screen",
      "components": [
        { "type": "Avatar", "src": "user-profile.jpg" },
        { "type": "TextField", "label": "Full Name" },
        { "type": "TextField", "label": "Email Address" },
        { "type": "TextField", "label": "Phone Number" },
        { "type": "Switch", "label": "Enable Dark Mode" },
        { "type": "Button", "label": "Update Profile" }
      ]
    },
    {
      "name": "Settings Screen",
      "components": [
        { "type": "Switch", "label": "Enable Notifications" },
        { "type": "Slider", "label": "Volume", "min": 0, "max": 100 },
        { "type": "Dropdown", "label": "Theme", "options": ["Light", "Dark", "System Default"] },
        { "type": "Button", "label": "Save Settings" }
      ]
    },
    {
      "name": "Chat Screen",
      "components": [
        { "type": "ChatBubble", "sender": "Alice", "message": "Hey, how are you?" },
        { "type": "ChatBubble", "sender": "Bob", "message": "I'm good, thanks! You?" },
        { "type": "ChatBubble", "sender": "Alice", "message": "Doing well! Are you free this weekend?" },
        { "type": "TextField", "label": "Type a message" },
        { "type": "Button", "label": "Send" }
      ]
    },
    {
      "name": "Booking Screen",
      "components": [
        { "type": "Calendar", "label": "Select a Date" },
        { "type": "TextField", "label": "Number of Guests" },
        { "type": "Dropdown", "label": "Booking Type", "options": ["Hotel", "Flight", "Car Rental"] },
        { "type": "Button", "label": "Confirm Booking" }
      ]
    },
    {
      "name": "Dashboard",
      "components": [
        { "type": "Tabs", "items": ["Overview", "Analytics", "Reports", "Settings"] },
        { "type": "Card", "title": "Total Sales", "value": "$50,000" },
        { "type": "Card", "title": "New Users", "value": "2,340" },
        { "type": "ProgressBar", "label": "Storage Usage", "value": 80 }
      ]
    },
    {
      "name": "E-Commerce Screen",
      "components": [
        { "type": "Card", "title": "Nike Shoes", "value": "$120" },
        { "type": "Card", "title": "Smartphone", "value": "$999" },
        { "type": "Dropdown", "label": "Sort By", "options": ["Price Low to High", "Price High to Low", "Popularity"] },
        { "type": "Button", "label": "Add to Cart" }
      ]
    },
    {
      "name": "Fitness Tracker",
      "components": [
        { "type": "ProgressBar", "label": "Daily Steps", "value": 60 },
        { "type": "Slider", "label": "Set Goal", "min": 5000, "max": 20000 },
        { "type": "Button", "label": "Start Workout" }
      ]
    }
  ]
}

  
  const WireframeAppSample = () => {
    const [wireframeData, setWireframeData] = useState(sampleJson);
  
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Wireframe Generator</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {wireframeData.screens.map((screen) => (
            <div key={screen.name} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", background: "#fff" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>{screen.name}</h3>
              {/* <WireframeRenderer wireframeData={{ screens: [screen] }} /> */}
              <UIComponentRenderer wireframeData={{ screens: [screen] }} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WireframeAppSample;
  