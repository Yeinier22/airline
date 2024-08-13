import styles from "./manageTrip.module.css";

export function ManageTrip() {
  return (
    <div>
      <p className={styles.specialPadding}>Manage Trips /Check-in</p>
      <form className={styles.formContainer}>
        <div className={styles.formItems}>
          <label htmlFor="lastName" className={styles.redDot}>
            Passenger last name
          </label>
          <input type="text" id="lastName" className={styles.searchTrip} />
        </div>
        <p>
          Check in beginning 24 hours and up to 45 minutes before your flight
          (90 minutes for international).
        </p>
        <div className={styles.formItems}>
          <label htmlFor="confirmation" className={styles.redDot}>
            Confirmation Code
          </label>
          <input
            text="text"
            id="confirmation"
            placeholder=".ex JCQNHD"
            className={styles.searchTrip}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.searchButton}>
            <span className={styles.buttonText}>Find your trip</span>
          </button>
        </div>
      </form>
    </div>
  );
}
