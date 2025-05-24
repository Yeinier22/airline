
import styles from "./prueba.module.css";


export default function Prueba() {

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutTotalContainer}>
        <div className={styles.checkoutTotalPrice}>
          <h3>Trip Total</h3>
          <p className={styles.checkoutPrice}>price</p>
          <button
            className={styles.deployPrice}
          >
            <span className={styles.buttonText}>View price summary</span>
          </button>
        </div>
        <button type="submit" className={styles.checkoutButton}>
          <span>Check out</span>
        </button>
      </div>
    </div>
  );
}
