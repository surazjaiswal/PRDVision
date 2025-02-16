import React from "react";
import Logo from "../../assets/ic_logo.png";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo-icon" />
        <div className="logo-text">PRDVision</div>
      </div>
    </header>
  );
};

export default Header;
