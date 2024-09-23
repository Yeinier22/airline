import { useEffect, useState } from "react";
import { VscSearch } from "react-icons/vsc";
import styles from "./Book.module.css";
//import { get } from "../utils/httpApi";
import SearchAutocomplete from "./flightStatus/search-autocomplete";
import { buildIndex } from "./flightStatus/airportsMap";
import locations from "./flightStatus/airports.json";
import TwoMonthsRangePicker from "../utils/date";
import { max } from "lodash";

const numberPasserger = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Book() {
  const [ctdadPassenger, setCtdadPassenger] = useState(1);
  const [trip, setTrip] = useState("Round trip");
  const [searchFrom, setSearchFrom] = useState("MIA");
  const [index, setIndex] = useState(null);
  const [startDate1, setStartDate1] = useState(null);
  const [startDate2, setStartDate2] = useState(null);
  const [minDate2, setMinDate2] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    const builtIndex = buildIndex(locations);
    setIndex(builtIndex);
  }, []);

  useEffect(() => {
    if (startDate1) {
      const date = new Date(startDate1);
      date.setDate(date.getDate() + 2);
      setMinDate2(date);
    }
    if(startDate2){
      const date = new Date(startDate2);
      date.setDate(date.getDate() - 1);
      setMaxDate(date);
    }
    console.log(startDate1);
  }, [startDate1, startDate2]);

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
            <SearchAutocomplete index={index} />
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
            <SearchAutocomplete index={index} />
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
          <TwoMonthsRangePicker
            id="depart"
            minDate={new Date()}
            startDate={startDate1}
            setStartDate={setStartDate1}
            maxDate={maxDate}
            endDate={startDate2}
            selectsRange
            onChangeDate={(date) => setStartDate1(date)} 
          />
        </div>
        <div className={styles.formItems}>
          <label htmlFor="return">Return</label>
          <TwoMonthsRangePicker
            id="return"
            minDate={minDate2}
            endDate={startDate2}
            setStartDate={setStartDate2}
            startDate={startDate2}
            selectsRange
            maxDate={null} 
            onChangeDate={(date) => setStartDate2(date)} 
          />
        </div>
        <button type="submit" className={styles.searchButton}>
          <span className={styles.buttonText}>Search</span>
        </button>
      </div>
    </form>
  );
}
