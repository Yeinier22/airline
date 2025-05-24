import { createContext, useState } from "react";

// Crea el contexto
export const FlightContext = createContext();

// Crea el proveedor para envolver la aplicación
export function FlightProvider({ children }) {
  const initialState = {
    departCity: {
      label: "",
      details: null,
    },
    returnCity: {
      label: "",
      details: null,
    },
    dateDepart: null,
    dateReturn: null,
    passengers: 1,
    currencyCode: "USD",
    includedAirlineCodes: "UA,NK,AC,AS,B6,F9,HA,WN",
    nonStop: true,
    key:null
  };

  const [flightInformation, setFlightInformation] = useState(initialState);

  return (
    <FlightContext.Provider value={{ flightInformation, setFlightInformation }}>
      {children}
    </FlightContext.Provider>
  );
}
