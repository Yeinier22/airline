import { FaSpinner } from "react-icons/fa";
import styles from "./Spinner.module.css";

export function Spinner({ showDelayMessage }) {
  return (
    <div className={styles.overlay}>
      <div style={{ textAlign: "center" }}>
        <FaSpinner className={styles.spinning} size={50} />
        {showDelayMessage && (
          <p style={{ marginTop: "1rem", color: "#333" }}>
            This may take a few seconds...
          </p>
        )}
      </div>
    </div>
  );
}
