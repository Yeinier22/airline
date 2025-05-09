import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <img src="./images/logo.png" alt="logo" />
          <h1>Flight Finder</h1>
        </div>
        <div className="menu-toggle-container">
          <button
            className={`hamburguer-icon ${
              isOpen ? "hamburguer-icon-open" : ""
            }`}
            onClick={toggle}
            aria-label="Toggle menu"
          >
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </button>
        </div>
        <nav className={`nav${isOpen ? "-open" : ""}`}>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#destinations">Destinations</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
