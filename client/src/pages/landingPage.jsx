
import { ManageTrip } from "../components/manageTrip";
import styles from "./landingPage.module.css";
import { FlightStatus } from "../components/flightStatus";
import { useEffect, useState } from "react";
import { detectCityName } from "../utils/geolocation";

export function LandingPage() {
  const [selectedButton, setSelectedButton] = useState(1);
  const [city, setCity] = useState(null);

  const handleFormChange = (buttonIndex) => {
    setSelectedButton(buttonIndex);
  };

  useEffect(() => {
    let cancelled = false;
    detectCityName().then((name) => {
      if (!cancelled) setCity(name);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.landingPage}>
      {city && (
        <div style={{
          margin: "8px 0",
          padding: "6px 10px",
          background: "#eff6ff",
          color: "#1e3a8a",
          border: "1px solid #bfdbfe",
          borderRadius: 8,
          display: "inline-block"
        }}>
          Your location: <strong>{city}</strong>
        </div>
      )}
      <nav>
        <ul className={styles.container}>
          <li className={styles.items}>
            <button
              type="button"
              onClick={() => handleFormChange(1)}
              className={`${styles.button} ${
                selectedButton === 1 ? styles.selected : ""
              }`}
            >
              <span className={styles.buttonText}>Book</span>
            </button>
          </li>
          <li className={styles.items}>
            <button
              type="button"
              onClick={() => handleFormChange(2)}
              className={`${styles.button} ${
                selectedButton === 2 ? styles.selected : ""
              }`}
            >
              <span className={styles.buttonText}>Manage trips /Check-in</span>
            </button>
          </li>
          <li className={styles.items}>
            <button
              type="button"
              onClick={() => handleFormChange(3)}
              className={`${styles.button} ${
                selectedButton === 3 ? styles.selected : ""
              }`}
            >
              <span className={styles.buttonText}>Flight status</span>
            </button>
          </li>
        </ul>
      </nav>
      {selectedButton === 2 && <ManageTrip />}
      {selectedButton === 3 && <FlightStatus />}
    </div>
  );
}
