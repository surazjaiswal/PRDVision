import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Product</h4>
          <a href="/features">Features</a>
          <a href="/use-cases">Use Cases</a>
          <a href="/security">Security</a>
          <a href="/api">API</a>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <a href="/documentation">Documentation</a>
          <a href="/guides">Guides</a>
          <a href="/blog">Blog</a>
          <a href="/support">Support</a>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <a href="/about">About</a>
          <a href="/careers">Careers</a>
          <a href="/contact">Contact</a>
          <a href="/legal">Legal</a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 PRDVision. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
