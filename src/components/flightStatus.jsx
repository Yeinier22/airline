import { useState } from "react";
import styles from "./flightStatus.module.css";

export function FlightStatus() {
  const [searchBy, setSearchBy] = useState("city");

  return (
    <div className={styles.flightStatusContainer}>
      <div className={styles.searchOptions}>
        <p>Search by:</p>
        <ul className={styles.options}>
          <li className={styles.tabList}>
            <input
              id="city"
              type="radio"
              name="search"
              value="city"
              onClick={(e) => setSearchBy(e.target.value)}
              defaultChecked
            />
            <label htmlFor="city" className={styles.tabLabel}>
              <span className={styles.inputText}>Cities</span>
            </label>
          </li>
          <li className={styles.tabList}>
            <input
              id="flight"
              type="radio"
              name="search"
              value="flight"
              onClick={(e) => setSearchBy(e.target.value)}
            />
            <label htmlFor="flight" className={styles.tabLabel}>
              <span className={styles.inputText}>Flight number</span>
            </label>
          </li>
        </ul>
      </div>
      <p className={styles.requiredNote}>
        <span className={styles.redDot}>(</span>
        <span className={styles.required}>Required)</span>
      </p>
      <form className={styles.formContainer}>
        <div className={styles.formContent}>
          {searchBy === "city" ? (
            <>
              <div className={styles.formItems}>
                <label htmlFor="from" className={styles.redDot}>
                  From
                </label>
                <input
                  id="from"
                  placeholder="City or airport"
                  className={styles.searchCity}
                />
              </div>
              <div className={styles.formItems}>
                <label htmlFor="to" className={styles.redDot}>
                  To
                </label>
                <input
                  id="to"
                  placeholder="City or airport"
                  className={styles.searchCity}
                />
              </div>
            </>
          ) : (
            <div className={styles.formItems}>
              <label htmlFor="to" className={styles.redDot}>
                Flight number
              </label>
              <input
                id="to"
                className={styles.searchCity}
              />
            </div>
          )}
          <div className={styles.formItems}>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" className={styles.searchCity} />
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.searchButton}>
              <span className={styles.buttonText}>Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
