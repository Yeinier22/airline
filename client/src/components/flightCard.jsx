import styles from "./flightCard.module.css";
import { airlineDescription } from "./flightDetailts/flightDescription";
import ItineraryDescription from "./flightDetailts/flightDescription";
import Hours from "./flightDetailts/hours";
import HourStop from "./flightDetailts/hourStop";
import { useState } from "react";
import LogoAirline from "./flightDetailts/logoAirline";

export function FlightCard({ itiner, onClick, isReturn, handleChangeFlight }) {
  const itineraryIndex = isReturn ? 1 : 0;

  //const dur = itiner.itineraries[0].duration;
  //const index1 = dur.indexOf("H");
  //const hours = dur.substring(2, index1);
  //const min = dur.substring(index1 + 1, dur.length - 1);

  const [departureHour, setDepartureHour] = useState(null);
  const [arrivalHour, setArrivalHour] = useState(null);


  const price = Math.round(itiner.price.grandTotal);

  return (
    <li className={styles.flightCard}>
      <button
        className={styles.buttonContainer}
        onClick={() => onClick(itiner, departureHour, arrivalHour)}
      >
        <div className={styles.logoFlight}>
          <LogoAirline itiner={itiner} />
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.hoursContainer}>
              <Hours
                itiner={itiner}
                itineraryIndex={itineraryIndex}
                onTimeCalculated={(depHour, arrHour) => {
                  setDepartureHour(depHour);
                  setArrivalHour(arrHour);
                }}
              />
              <div className={styles.ItineraryDescription}>
                <ItineraryDescription isReturn={isReturn} />
              </div>
              <p className={styles.airlines}>{airlineDescription(itiner)}</p>
            </div>
            <div className={styles.hourStop}>
              <HourStop itiner={itiner} itineraryIndex={itineraryIndex} />
            </div>
          </div>
          <div className={styles.priceContainer}>
            <p className={styles.price}>${price}</p>
            {isReturn && (
              <button
                className={styles.changeFlight}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeFlight();
                }}
              >
                <span className={styles.buttonText}>Change Flight</span>
              </button>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}
