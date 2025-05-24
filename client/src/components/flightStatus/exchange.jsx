import React, { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import "./exchange.css";
import { useContext } from "react";
import { FlightContext } from "../../utils/flightContext";

function ExchangeInputs({error,  formState, setFormState }) {
  const [rotated, setRotated] = useState(false);
  const { setFlightInformation, flightInformation } = useContext(FlightContext);

  const handleSwap = () => {
    setRotated(!rotated);
    setFormState({
      departCity: formState.returnCity,
      returnCity: formState.departCity,
    });
  };

  return (
    <div className={`icon-container ${error ? "error" : ""}`}>
      <FaSyncAlt
        className={`swap-icon ${rotated ? "rotating" : ""} `}
        onClick={handleSwap}
        color="blue"
        size={20}
      />
    </div>
  );
}

export default ExchangeInputs;
