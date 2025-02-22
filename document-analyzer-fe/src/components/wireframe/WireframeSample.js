import React, { useState } from "react";
import WireframeRenderer from "./WireframeNew";
import UIComponentRenderer from "./KonvaRenderer";
import ReactFlowRenderer from "./ReactFlowRenderer";

const sampleJson = {
  screens: [
    {
      name: "Login Screen",
      components: [
        { type: "TextField", label: "Username" },
        { type: "TextField", label: "Password" },
        { type: "Button", label: "Login" },
        { type: "Button", label: "Forgot Password?" },
      ],
    },
    {
      name: "Profile Screen",
      components: [
        { type: "Avatar", src: "user-profile.jpg" },
        { type: "TextField", label: "Full Name" },
        { type: "TextField", label: "Email Address" },
        { type: "TextField", label: "Phone Number" },
        { type: "Switch", label: "Enable Dark Mode" },
        { type: "Button", label: "Update Profile" },
      ],
    },
    {
      name: "Settings Screen",
      components: [
        { type: "Switch", label: "Enable Notifications" },
        { type: "Slider", label: "Volume", min: 0, max: 100 },
        {
          type: "Dropdown",
          label: "Theme",
          options: ["Light", "Dark", "System Default"],
        },
        { type: "Button", label: "Save Settings" },
      ],
    },
    {
      name: "Chat Screen",
      components: [
        { type: "ChatBubble", sender: "Alice", message: "Hey, how are you?" },
        {
          type: "ChatBubble",
          sender: "Bob",
          message: "I'm good, thanks! You?",
        },
        {
          type: "ChatBubble",
          sender: "Alice",
          message: "Doing well! Are you free this weekend?",
        },
        { type: "TextField", label: "Type a message" },
        { type: "Button", label: "Send" },
      ],
    },
    {
      name: "Booking Screen",
      components: [
        { type: "Calendar", label: "Select a Date" },
        { type: "TextField", label: "Number of Guests" },
        {
          type: "Dropdown",
          label: "Booking Type",
          options: ["Hotel", "Flight", "Car Rental"],
        },
        { type: "Button", label: "Confirm Booking" },
      ],
    },
    {
      name: "Dashboard",
      components: [
        {
          type: "Tabs",
          items: ["Overview", "Analytics", "Reports", "Settings"],
        },
        { type: "Card", title: "Total Sales", value: "$50,000" },
        { type: "Card", title: "New Users", value: "2,340" },
        { type: "ProgressBar", label: "Storage Usage", value: 80 },
      ],
    },
    {
      name: "E-Commerce Screen",
      components: [
        { type: "Card", title: "Nike Shoes", value: "$120" },
        { type: "Card", title: "Smartphone", value: "$999" },
        {
          type: "Dropdown",
          label: "Sort By",
          options: ["Price Low to High", "Price High to Low", "Popularity"],
        },
        { type: "Button", label: "Add to Cart" },
      ],
    },
    {
      name: "Fitness Tracker",
      components: [
        { type: "ProgressBar", label: "Daily Steps", value: 60 },
        { type: "Slider", label: "Set Goal", min: 5000, max: 20000 },
        { type: "Button", label: "Start Workout" },
      ],
    },
  ],
};

const sampleJson2 = {
  screens: [
    {
      name: "Login Screen",
      layout: "centered",
      components: [
        { type: "Logo", position: "top" },
        { type: "Heading", text: "Welcome" },
        { type: "TextField", label: "Email", placeholder: "Enter your email" },
        {
          type: "TextField",
          label: "Password",
          placeholder: "Enter your password",
          secure: true,
        },
        { type: "Button", label: "Sign in", style: "primary", fullWidth: true },
        { type: "Link", text: "Forgot Password?", align: "right" },
        {
          type: "Button",
          label: "Create Account",
          style: "secondary",
          fullWidth: true,
        },
      ],
    },
    {
      name: "Profile Screen",
      layout: "scrollable",
      components: [
        {
          type: "Avatar",
          src: "user-profile.jpg",
          size: "large",
          alignment: "center",
        },
        {
          type: "TextField",
          label: "Full Name",
          placeholder: "Enter your name",
        },
        {
          type: "TextField",
          label: "Email Address",
          placeholder: "Enter your email",
        },
        {
          type: "TextField",
          label: "Phone Number",
          placeholder: "Enter your phone number",
        },
        { type: "Switch", label: "Enable Dark Mode" },
        {
          type: "Button",
          label: "Update Profile",
          style: "primary",
          fullWidth: true,
        },
      ],
    },
    {
      name: "Settings Screen",
      layout: "list",
      components: [
        { type: "Switch", label: "Enable Notifications" },
        { type: "Slider", label: "Volume", min: 0, max: 100, value: 50 },
        {
          type: "Dropdown",
          label: "Theme",
          options: ["Light", "Dark", "System Default"],
        },
        {
          type: "Button",
          label: "Save Settings",
          style: "primary",
          fullWidth: true,
        },
      ],
    },
    {
      name: "Chat Screen",
      layout: "stacked",
      components: [
        { type: "ChatBubble", sender: "Alice", message: "Hey, how are you?" },
        {
          type: "ChatBubble",
          sender: "Bob",
          message: "I'm good, thanks! You?",
        },
        {
          type: "ChatBubble",
          sender: "Alice",
          message: "Doing well! Are you free this weekend?",
        },
        {
          type: "TextField",
          label: "Type a message",
          placeholder: "Write a message...",
        },
        { type: "Button", label: "Send", style: "primary", align: "right" },
      ],
    },
    {
      name: "Booking Screen",
      layout: "form",
      components: [
        { type: "Calendar", label: "Select a Date" },
        {
          type: "TextField",
          label: "Number of Guests",
          placeholder: "Enter number of guests",
        },
        {
          type: "Dropdown",
          label: "Booking Type",
          options: ["Hotel", "Flight", "Car Rental"],
        },
        {
          type: "Button",
          label: "Confirm Booking",
          style: "primary",
          fullWidth: true,
        },
      ],
    },
    {
      name: "Dashboard",
      layout: "grid",
      components: [
        {
          type: "Tabs",
          items: ["Overview", "Analytics", "Reports", "Settings"],
        },
        { type: "Card", title: "Total Sales", value: "$50,000", icon: "chart" },
        { type: "Card", title: "New Users", value: "2,340", icon: "users" },
        {
          type: "ProgressBar",
          label: "Storage Usage",
          value: 80,
          color: "blue",
        },
      ],
    },
    {
      name: "E-Commerce Screen",
      layout: "product-grid",
      components: [
        {
          type: "Card",
          title: "Nike Shoes",
          value: "$120",
          image: "nike-shoes.jpg",
        },
        {
          type: "Card",
          title: "Smartphone",
          value: "$999",
          image: "smartphone.jpg",
        },
        {
          type: "Dropdown",
          label: "Sort By",
          options: ["Price Low to High", "Price High to Low", "Popularity"],
        },
        {
          type: "Button",
          label: "Add to Cart",
          style: "primary",
          fullWidth: true,
        },
      ],
    },
    {
      name: "Fitness Tracker",
      layout: "dashboard",
      components: [
        {
          type: "ProgressBar",
          label: "Daily Steps",
          value: 60,
          color: "green",
        },
        {
          type: "Slider",
          label: "Set Goal",
          min: 5000,
          max: 20000,
          value: 10000,
        },
        {
          type: "Button",
          label: "Start Workout",
          style: "primary",
          fullWidth: true,
        },
      ],
    },
  ],
};

const sampleJson3 = {
  screens: [
    {
      label: "Login",
      components: [
        {
          type: "TextField",
          label: "Username",
        },
        {
          type: "TextField",
          label: "Password",
          secure: true,
        },
        {
          type: "Button",
          label: "Login",
        },
        {
          type: "Button",
          label: "Forgot Password?",
        },
        {
          type: "Button",
          label: "Sign Up",
        },
        {
          type: "Button",
          label: "Biometric Login",
        },
      ],
    },
    {
      label: "Signup",
      components: [
        {
          type: "TextField",
          label: "Full Name",
        },
        {
          type: "TextField",
          label: "Email",
        },
        {
          type: "TextField",
          label: "Password",
          secure: true,
        },
        {
          type: "TextField",
          label: "Confirm Password",
          secure: true,
        },
        {
          type: "Button",
          label: "Create Account",
        },
      ],
    },
    {
      label: "Dashboard",
      components: [
        {
          type: "Text",
          label: "Account Balance: $1234.56",
        },
        {
          type: "Button",
          label: "Transfer Funds",
        },
        {
          type: "Button",
          label: "View Transaction History",
        },
        {
          type: "Button",
          label: "Spending Analysis",
        },
        {
          type: "Notification",
          message: "New transaction received",
        },
      ],
    },
    {
      label: "Fund Transfer",
      components: [
        {
          type: "Dropdown",
          label: "From Account",
          options: ["Checking", "Savings"],
        },
        {
          type: "Dropdown",
          label: "To Account",
          options: ["Checking", "Savings", "External Account"],
        },
        {
          type: "TextField",
          label: "Amount",
        },
        {
          type: "TextField",
          label: "Note (Optional)",
        },
        {
          type: "Button",
          label: "Transfer",
        },
      ],
    },
    {
      label: "Transaction History",
      components: [
        {
          type: "List",
          items: [
            {
              date: "2024-03-08",
              description: "Transfer to Savings",
              amount: "-$100.00",
            },
            {
              date: "2024-03-07",
              description: "Deposit",
              amount: "$500.00",
            },
          ],
        },
      ],
    },
    {
      label: "Spending Analysis",
      components: [
        {
          type: "PieChart",
        },
      ],
    },
    {
      label: "Settings",
      components: [
        {
          type: "Switch",
          label: "Dark Mode",
        },
        {
          type: "Switch",
          label: "Enable Notifications",
        },
        {
          type: "Button",
          label: "Logout",
        },
      ],
    },
  ],
  edges: [
    {
      from: 0,
      to: 1,
    },
    {
      from: 0,
      to: 2,
    },
    {
      from: 1,
      to: 2,
    },
    {
      from: 2,
      to: 3,
    },
    {
      from: 2,
      to: 4,
    },
    {
      from: 2,
      to: 5,
    },
    {
      from: 2,
      to: 6,
    },
  ],
};

const sampleJson4 = {
  screens: [
    {
      name: "Login",
      elements: [
        { type: "text", text: "Login", style: "title" },
        { type: "input", placeholder: "Email", alignment: "center" },
        { type: "input", placeholder: "Password", alignment: "center" },
        { type: "button", text: "Login", color: "blue", alignment: "center" },
        { type: "button", text: "Sign Up", color: "blue", alignment: "center" },
      ],
    },
    {
      name: "Sign Up",
      elements: [
        { type: "text", text: "Sign Up", style: "title" },
        { type: "input", placeholder: "Full Name", alignment: "center" },
        { type: "input", placeholder: "Email", alignment: "center" },
        { type: "input", placeholder: "Password", alignment: "center" },
        { type: "input", placeholder: "Confirm Password", alignment: "center" },
        {
          type: "button",
          text: "Create Account",
          color: "blue",
          alignment: "center",
        },
      ],
    },
    {
      name: "Home Feed",
      elements: [
        { type: "avatar", label: "Avatar", alignment: "left" },
        {
          type: "input",
          placeholder: "What's on your mind?",
          alignment: "center",
        },
        { type: "button", text: "Post", color: "blue", alignment: "center" },
        { type: "image", label: "Image", alignment: "center" },
        { type: "video", source: "video.mp4", alignment: "center" },
        { type: "progress", value: 50, alignment: "center" },
        { type: "checkbox", label: "Show Online Status", alignment: "left" },
      ],
    },
    {
      name: "Profile",
      elements: [
        { type: "avatar", label: "Avatar", alignment: "center" },
        {
          type: "tabs",
          items: ["Posts", "About", "Connections"],
          alignment: "center",
        },
        { type: "slider", value: 75, alignment: "center" },
        { type: "slider", value: 40, alignment: "center" },
      ],
    },
    {
      name: "Connections",
      elements: [
        { type: "avatar", label: "Avatar", alignment: "center" },
        { type: "dropdown", label: "Sort by Name", alignment: "center" },
      ],
    },
    {
      name: "Settings",
      elements: [
        { type: "checkbox", label: "Dark Mode", alignment: "left" },
        { type: "checkbox", label: "Enable Notifications", alignment: "left" },
        { type: "button", text: "Logout", color: "blue", alignment: "center" },
      ],
    },
  ],
};

const sampleJson5 = {
  screens: [
    {
      label: "Login",
      components: [
        {
          type: "TextField",
          label: "Email",
        },
        {
          type: "TextField",
          label: "Password",
        },
        {
          type: "Button",
          label: "Login",
        },
        {
          type: "Button",
          label: "Sign Up",
        },
        {
          type: "Button",
          label: "Google Authentication",
        },
      ],
    },
    {
      label: "Sign Up",
      components: [
        {
          type: "TextField",
          label: "Full Name",
        },
        {
          type: "TextField",
          label: "Email",
        },
        {
          type: "TextField",
          label: "Password",
        },
        {
          type: "TextField",
          label: "Confirm Password",
        },
        {
          type: "Button",
          label: "Create Account",
        },
      ],
    },
    {
      label: "Dashboard",
      components: [
        {
          type: "List",
          label: "Quiz History",
        },
        {
          type: "List",
          label: "Recommendations",
        },
        {
          type: "Chart",
          label: "Performance Stats",
        },
      ],
    },
    {
      label: "Quiz Selection",
      components: [
        {
          type: "Dropdown",
          label: "Topic",
        },
        {
          type: "Dropdown",
          label: "Quiz Type",
        },
        {
          type: "Button",
          label: "Start Quiz",
        },
      ],
    },
    {
      label: "Quiz Page",
      components: [
        {
          type: "Text",
          label: "Question",
        },
        {
          type: "RadioGroup",
          label: "Options",
        },
        {
          type: "TextField",
          label: "Answer",
        },
        {
          type: "Timer",
        },
        {
          type: "Button",
          label: "Submit",
        },
      ],
    },
    {
      label: "Results Page",
      components: [
        {
          type: "Text",
          label: "Score",
        },
        {
          type: "List",
          label: "Correct/Incorrect Answers",
        },
        {
          type: "Text",
          label: "AI Feedback",
        },
        {
          type: "List",
          label: "Improvement Plan",
        },
        {
          type: "List",
          label: "Suggested Quizzes",
        },
      ],
    },
    {
      label: "Quiz Creation",
      components: [
        {
          type: "TextField",
          label: "Question",
        },
        {
          type: "TextField",
          label: "Options",
        },
        {
          type: "Button",
          label: "Add Question",
        },
        {
          type: "Button",
          label: "Generate Questions (AI)",
        },
        {
          type: "Button",
          label: "Publish Quiz",
        },
      ],
    },
    {
      label: "Admin Panel",
      components: [
        {
          type: "List",
          label: "Manage Users",
        },
        {
          type: "List",
          label: "Manage Quizzes",
        },
        {
          type: "List",
          label: "System Settings",
        },
      ],
    },
  ],
  edges: [
    {
      from: 0,
      to: 2,
    },
    {
      from: 0,
      to: 1,
    },
    {
      from: 1,
      to: 2,
    },
    {
      from: 2,
      to: 3,
    },
    {
      from: 3,
      to: 4,
    },
    {
      from: 4,
      to: 5,
    },
    {
      from: 2,
      to: 7,
    },
    {
      from: 7,
      to: 4,
    },
    {
      from: 2,
      to: 8,
    },
  ],
};

const WireframeAppSample = () => {
  const [wireframeData, setWireframeData] = useState(sampleJson5);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Wireframes</h2>
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
          border: "1px solid green",
        }}
      >
        <ReactFlowRenderer wireframeData={{ screens: wireframeData }} />
      </div>
    </div>
  );
};

export default WireframeAppSample;
