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
    AS: "Alaska Airlines",
    WN: "Southwest Airlines",
    DM: "Arajet",
    VB: "VivaAerobus",
    SY: "Sun Country Airlines",
    BW: "Caribbean Airlines",
  };

  const carrierCode = itiner.itineraries[0].segments[0].carrierCode;
  const carrierName = itiner.validatingAirlineNames?.[0];

  return carrierName || logAirlines[carrierCode] || carrierCode;
}

export default function ItineraryDescription({ isReturn }) {
  const {flightInformation} = useContext(FlightContext);
  const { depart, departCode, arrival, arrivalCode } = useFlightDescription(
    isReturn,
    flightInformation
  );

  return <p>{`${depart} (${departCode}) - ${arrival} (${arrivalCode})`}</p>;
}
