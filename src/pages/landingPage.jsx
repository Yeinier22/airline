import { Book } from "../components/Book";
import { ManageTrip } from "../components/manageTrip";
import styles from "./landingPage.module.css";
import { FlightStatus } from "../components/flightStatus";
import { useState } from "react";

export function LandingPage() {
  const [selectedButton, setSelectedButton] = useState(1);

  const handleFormChange = (buttonIndex) => {
    setSelectedButton(buttonIndex);
  };

  return (
    <div className={styles.landingPage}>
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
      {selectedButton === 1 && <Book />}
      {selectedButton === 2 && <ManageTrip />}
      {selectedButton === 3 && <FlightStatus />}
    </div>
  );
}
