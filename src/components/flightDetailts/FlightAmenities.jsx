import { getCheckedBagLabels } from "../../utils/amenitiesBaggage";
import { getSeatLabels } from "../../utils/amenitiesSeat";
import styles from "./FlightAmenities.module.css";

export default function FlightAmenities({ itiner }) {
  const labelsBag = getCheckedBagLabels(itiner);
  const labelsSeat = getSeatLabels(itiner);

  return (
    <div className={styles.amenetiesContainer}>
      {labelsSeat && (
        <div className={styles.seatContainer}>
          <p>
            <strong>Seat:</strong>
          </p>
          <div className={styles.seatAmenities}>{labelsSeat}</div>
        </div>
      )}
      {labelsBag.length > 0 ? (
        <div className={styles.bagContainer}>
          <p>
            <strong>Bags:</strong>
          </p>
          <div className={styles.bagAmenities}>{labelsBag}</div>
        </div>
      ) : null}
    </div>
  );
}
