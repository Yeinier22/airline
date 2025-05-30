import {  useState } from "react";
import "./tripTypeSelector.css";

function TripSelector() {
  const [selected, setSelected] = useState("Roundtrip");
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleClick = (tripType) => {
    setSelected(tripType);
    setHasInteracted(true); // Activamos la animación después de la primera interacción
  };

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
