import styles from "./itinerarySegment.module.css";
import Hours from "../components/flightDetailts/hours";
import HourStop from "../components/flightDetailts/hourStop";
import LogoAirline from "../components/flightDetailts/logoAirline";
import { airlineDescription } from "../components/flightDetailts/flightDescription";
import { formatDateString } from "../utils/formatDate";

export default function ItinerarySegment({
  depart,
  arrival,
  selectedItinerary,
  handleChangeFlight,
  flightInformationLocal,
  value,
  isReturn,
}) {
  return (
    <div className={`${styles.segmentContainer} ${styles.departureContainer}`}>
      <p className={styles.itineraryLabel}>
        {depart} to {arrival}
      </p>
      <div className={styles.hours}>
        <Hours
          itiner={selectedItinerary}
          customHoursLineClass={styles.lineCustom}
          itineraryIndex={value}
        />
        <div className={styles.parenthesis}>
          <span>(</span>
          <HourStop
            itiner={selectedItinerary}
            separator=","
            itineraryIndex={value}
          />
          <span>)</span>
        </div>
      </div>
      <div className={styles.airlineDescriptionContainer}>
        <div className={styles.airlineDescription}>
          <div className={styles.logoModal}>
            <LogoAirline itiner={selectedItinerary} />
          </div>
          <p className={styles.airlines}>
            {airlineDescription(selectedItinerary)}
          </p>
          <p> • {formatDateString(flightInformationLocal)}</p>
        </div>
        <button
          className={styles.changeFlight}
          onClick={() => handleChangeFlight(false)}
          aria-label="Change departure flight"
        >
          <span className={styles.buttonText}>Change Flight</span>
        </button>
      </div>
    </div>
  );
}
