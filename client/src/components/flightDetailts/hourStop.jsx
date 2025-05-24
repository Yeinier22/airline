import styles from "./hourStop.module.css";

////Format de total time of flight////
////////////////////////////////////
const totalTime = (itiner,itineraryIndex) => {
  const dur = itiner.itineraries[itineraryIndex].duration;
  // Find the position of "H" and "M" to extract the hours and minutes
  const hoursIndex = dur.indexOf("H");
  const minsIndex = dur.indexOf("M");
  // Extract the hours part if it exists, otherwise set to "0"
  const hours = hoursIndex !== -1 ? dur.substring(2, hoursIndex) : "0";
  // Extract the minutes part if it exists, otherwise set to "0"
  const min = minsIndex !== -1 ? dur.substring(hoursIndex + 1, minsIndex) : "0";
  return `${hours}h ${min}m`;
};

export default function HourStop({ itiner, separator = "•", itineraryIndex}) {

  const haveStop = itiner.itineraries[itineraryIndex].segments.length > 1;
  const numStops = haveStop
    ? itiner.itineraries[itineraryIndex].segments.length - 1
    : 0;
  const stops =
    numStops > 0 ? `${numStops} ${numStops > 1 ? "stops" : "stop"}` : "Nonstop";

  return (
    <div className={styles.hoursStop}>
      <p className={styles.totalHours}>{totalTime(itiner, itineraryIndex)}</p>
      <span className={styles.separator}>{separator}</span>
      <p className={`${styles.stops} ${numStops === 0 ? styles.nonStops : ""}`}>
        {stops}
      </p>
    </div>
  );
}
