import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
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
            type="submit"
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
              <Link
                to="/"
                state={{ isReturnBook: false, resetSearch: true }}
                onClick={() => setIsOpen(false)}
              >
                Book
              </Link>
            </li>
            <li>
              <Link to="/destinations" onClick={() => setIsOpen(false)}>
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
