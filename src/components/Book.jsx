import { useEffect, useState } from "react";
import { VscSearch } from "react-icons/vsc";
import styles from "./Book.module.css";
//import { get } from "../utils/httpApi";
import SearchAutocomplete from "./flightStatus/search-autocomplete";

const numberPasserger = [1, 2, 3, 4, 5, 6, 7, 8, 9];


export function Book() {
  const [ctdadPassenger, setCtdadPassenger] = useState(1);
  const [trip, setTrip] = useState("Round trip");
  const [searchFrom, setSearchFrom] = useState("MIA");


  return (
    <form className={styles.formContainer}>
      <div className={styles.radioContainer}>
        <label>
          <input
            type="radio"
            defaultChecked
            name="option"
            value="Round trip"
            onChange={(e) => setTrip("Round trip")}
          />
          Round trip
        </label>
        <label>
          <input
            type="radio"
            name="option"
            value="One way"
            onChange={(e) => setTrip("One way")}
          />
          One way
        </label>
      </div>
      <div className={styles.formCityContainer}>
        <div className={styles.formItems}>
          <label htmlFor="from">From </label>
          <div className={styles.formCity}>
          <SearchAutocomplete
              search={{ city: false, airport: true }}
              setSearch={(search) => setSearchFrom(search.keyword)}
            />
            <VscSearch
              color="#0078d2"
              size={20}
              className={styles.searchIcon}
            />
          </div>
        </div>
        <div className={styles.formItems}>
          <label htmlFor="to">To</label>
          <div className={styles.formCity}>
            <input
              type="text"
              id="to"
              placeholder="City o Airport"
              className={`${styles.searchInput} ${styles.withIcon}`}
            />
            <VscSearch
              color="#0078d2"
              size={20}
              className={styles.searchIcon}
            />
          </div>
        </div>
        <div className={styles.formItems}>
          <label htmlFor="num_passenger">Number of passengers</label>
          <select
            id="num_passenger"
            value={ctdadPassenger}
            onChange={(e) => setCtdadPassenger(e.target.value)}
            className={styles.selectInput}
          >
            {numberPasserger.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formItems}>
          <label htmlFor="depart">Depart</label>
          <input type="date" id="depart" className={styles.dateInput} />
        </div>
        <div className={styles.formItems}>
          <label htmlFor="Return">Return</label>
          <input type="date" id="return" className={styles.dateInput} />
        </div>
        <button type="submit" className={styles.searchButton}>
          <span className={styles.buttonText}>Search</span>
        </button>
      </div>
    </form>
  );
}
