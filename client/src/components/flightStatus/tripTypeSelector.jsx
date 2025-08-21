import {  useState, useEffect } from "react";
import "./tripTypeSelector.css";

function TripSelector({ onTripTypeChange }) {
  const [selected, setSelected] = useState("Roundtrip");
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleClick = (tripType) => {
    setSelected(tripType);
    setHasInteracted(true); // Activamos la animación después de la primera interacción
    
    // Comunicar el cambio al componente padre
    if (onTripTypeChange) {
      onTripTypeChange(tripType);
    }
  };

  // Comunicar el valor inicial al montar el componente
  useEffect(() => {
    if (onTripTypeChange) {
      onTripTypeChange(selected);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]); // Incluir las dependencias

  return (
    <div>
      <ul className="tripSelect">
        <li
          className={`tripType ${selected === "Roundtrip" ? "selected" : ""} ${
            hasInteracted ? "animate" : ""
          }`}
          onClick={() => handleClick("Roundtrip")}
        >
          Roundtrip
        </li>
        <li
          className={`tripType ${selected === "One-way" ? "selected" : ""} ${
            hasInteracted ? "animate" : ""
          }`}
          onClick={() => handleClick("One-way")}
        >
          One-Way
        </li>
      </ul>
    </div>
  );
}

export default TripSelector;
