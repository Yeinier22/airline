import { useRef, useState } from "react";
import styles from "./numPassenger.module.css";
import { IoPerson } from "react-icons/io5";


const numberPasserger = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function NumPassenger() {
  const [ctdadPassenger, setCtdadPassenger] = useState(1);
  const selectRef = useRef(null);


  return (
    <div className={styles.travelerContainer}>
      <select
        id="num_passenger"
        value={ctdadPassenger}
        onChange={(e) => setCtdadPassenger(e.target.value)}
        className={styles.selectInput}
        ref={selectRef}
      >
        {numberPasserger.map((number) => (
          <option key={number} value={number}>
            {number}
            {number === 1 ? "  traveler" : "  travelers"}
          </option>
        ))}
      </select>
      <IoPerson className={styles.IoPerson}/>
    </div>
  );
}

export default NumPassenger;
