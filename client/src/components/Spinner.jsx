import { FaSpinner } from "react-icons/fa";
import styles from "./Spinner.module.css";

export function Spinner() {
  return (
    <div className={styles.overlay}>
      <FaSpinner className={styles.spinning} size={50} />
    </div>
  );
}
