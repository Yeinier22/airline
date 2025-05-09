import React, { useState, useRef, useEffect } from "react";
import { IoPerson, IoChevronDown, IoChevronUp } from "react-icons/io5";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ options, label, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option); // Notifica al padre si hay un cambio
    }
  };

  // Cierra el dropdown si haces clic fuera
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectBox} onClick={toggleDropdown}>
        <span className={styles.selected}>{selected}</span>
        {isOpen ? (
          <IoChevronUp className={styles.icon} />
        ) : (
          <IoChevronDown className={styles.icon} />
        )}
      </div>
      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;