import { useFlightDescription } from "../../hooks/useFlightDescription";
import { useContext } from "react";
import { FlightContext } from "../../utils/flightContext";

export function airlineDescription(itiner) {
  const logAirlines = {
    UA: "United Airlines",
    AC: "Air Canada",
    NK: "Spirit Airlines",
    F9: "Frontier Airlines",
    HA: "Hawaiian Airlines",
    B6: "JetBlue Airways",
  };

  const carrierCode = itiner.itineraries[0].segments[0].carrierCode;
  //const IsCarrierCode = carrierCode in logAirlines; //devuelve true o false

  return logAirlines[carrierCode] || carrierCode;
}

export default function ItineraryDescription({ isReturn }) {
  const {flightInformation} = useContext(FlightContext);
  const { depart, departCode, arrival, arrivalCode } = useFlightDescription(
    isReturn,
    flightInformation
  );

  return <p>{`${depart} (${departCode}) - ${arrival} (${arrivalCode})`}</p>;
}
