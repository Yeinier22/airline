import { useEffect } from "react";
import styles from "./hours.module.css";

function formatTime(stringHours) {
  if (!stringHours) {
    return "Invalid Time";
  }

  const date = new Date(stringHours);
  if (isNaN(date.getTime())) {
    return "Invalid Time"; // Evita errores con fechas inválidas
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convierte 0 en 12 para 12 AM
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}${ampm}`;
}

export default function Hours({
  itiner,
  onTimeCalculated,
  customHoursLineClass,
  itineraryIndex, 
}) {
  /*if (!itiner) {
    console.error("Error: itiner is undefined in Hours");
    return null; // Evita renderizar si `itiner` es undefined
  }*/

  const haveStop = itiner.itineraries[itineraryIndex].segments.length > 1;
  const arrivalHour = haveStop
    ? itiner.itineraries[itineraryIndex].segments[1].arrival.at
    : itiner.itineraries[itineraryIndex].segments[0].arrival.at;
  const departureHour =
    itiner.itineraries[itineraryIndex].segments[0].departure.at;

  useEffect(() => {
    if (onTimeCalculated) {
      onTimeCalculated(departureHour, arrivalHour);
    }
  }, [departureHour, arrivalHour, onTimeCalculated]);

  return (
    <div className={styles.hours}>
      <span className={styles.time}>{formatTime(departureHour)}</span>
      <span
        className={`${styles.hoursLine} ${customHoursLineClass || ""}`.trim()}
      ></span>
      <span className={styles.time}>{formatTime(arrivalHour)}</span>
    </div>
  );
}
