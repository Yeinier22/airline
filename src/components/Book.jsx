import { useEffect, useState } from "react";
import { VscSearch } from "react-icons/vsc";
import styles from "./Book.module.css";
//import { get } from "../utils/httpApi";
import SearchAutocomplete from "./flightStatus/search-autocomplete";
import { buildIndex } from "./flightStatus/airportsMap";
import locations from "./flightStatus/airports.json";
import TwoMonthsRangePicker from "../utils/date";
import { max } from "lodash";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useContext } from "react";
import { FlightContext } from "../utils/flightContext";
import { handleDepartCityChange } from "../utils/flightHelpers";
import { handleReturnCityChange } from "../utils/flightHelpers";

const numberPasserger = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Book() {
  const [ctdadPassenger, setCtdadPassenger] = useState(1);
  const [trip, setTrip] = useState("Round trip");
  const [searchFrom, setSearchFrom] = useState("");
  const [index, setIndex] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minDate2, setMinDate2] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [maxDate, setMaxDate] = useState(null);
  const { setFlightInformation, flightInformation } = useContext(FlightContext);
  const departCityChangeHandler = handleDepartCityChange(setFlightInformation);
  const returnCityChangeHandler = handleReturnCityChange(setFlightInformation);
  const navigate = useNavigate();

  //////////To know if it is a manual page reload////////////
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("manualReload", "true"); // Marcar recarga manual
    };
    // Escuchar el evento de recarga manual
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      // Limpiar el listener cuando el componente se desmonte
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //////////Para saber si es un reinicio de pagina manual////////////
  useEffect(() => {
    const isManualReload = sessionStorage.getItem("manualReload") === "true";
    if (isManualReload) {
      // Se detectó una recarga manual, resetear el estado
      sessionStorage.removeItem("manualReload"); // Limpiar la bandera de recarga
      localStorage.removeItem("flightInformation");
      setFlightInformation({
        departCity: {},
        returnCity: {},
        dateDepart: "",
        dateReturn: "",
        passengers: 1,
        currencyCode: "USD",
      });
    }
  }, []);

  useEffect(() => {
    const savedFlightInformation = JSON.parse(
      localStorage.getItem("flightInformation")
    );
    if (savedFlightInformation) {
      setFlightInformation(savedFlightInformation);
      // Cargar las fechas, pasajeros, y cualquier otro dato que necesites
      setCtdadPassenger(savedFlightInformation.passengers || 1);
      setStartDate(
        savedFlightInformation.dateDepart
          ? new Date(savedFlightInformation.dateDepart)
          : null
      );
      setEndDate(
        savedFlightInformation.dateReturn
          ? new Date(savedFlightInformation.dateReturn)
          : null
      );
      // Aquí también podrías directamente manejar las ciudades
      //handleDepartCityChange(savedFlightInformation.departCity || "");
      //handleReturnCityChange(savedFlightInformation.returnCity || "");
    }
  }, []);

  useEffect(() => {
    const builtIndex = buildIndex(locations);
    setIndex(builtIndex);
  }, []);

  useEffect(() => {
    if (startDate) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + 1);
      setMinDate2(date);
    }
    if (endDate) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - 1);
      setMaxDate(date);
    }
  }, [startDate, endDate]);

  // Manejador de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFlightInformation = {
      ...flightInformation,
      dateDepart: startDate,
      dateReturn: endDate,
      passengers: ctdadPassenger,
      currencyCode: flightInformation.currencyCode || "USD",
      includedAirlineCodes: "UA,NK,AC,AS,B6,F9,HA,WN",
      nonStop: true,
    };
    // Actualiza el contexto y localStorage antes de navegar
    setFlightInformation(updatedFlightInformation);
    localStorage.setItem(
      "flightInformation",
      JSON.stringify(updatedFlightInformation)
    );
    navigate("/booking");
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
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
              index={index}
              onSearchChange={departCityChangeHandler}
              initialValue={flightInformation.departCity.label}
              searchIcon={styles.searchIcon}
            />
          </div>
        </div>
        <div className={styles.formItems}>
          <label htmlFor="to">To</label>
          <div className={styles.formCity}>
            <SearchAutocomplete
              index={index}
              onSearchChange={returnCityChangeHandler}
              initialValue={flightInformation.returnCity.label}
              searchIcon={styles.searchIcon}
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
            start={startDate}
            startDate={startDate}
            setStartDate={setStartDate}
            maxDate={maxDate}
            endDate={endDate}
            onChangeDate={(date) => setStartDate(date)}
          />
        </div>
        <div className={styles.formItems}>
          <label htmlFor="return">Return</label>
          <TwoMonthsRangePicker
            id="return"
            minDate={
              startDate ? new Date(startDate.getTime() + 86400000) : new Date()
            } // Un día después de la fecha de salida
            start={endDate} // Fecha de salida para mostrar el rango visual
            startDate={startDate}
            endDate={endDate} // Fecha de retorno
            setStartDate={setEndDate} // Actualiza la fecha de retorno
            //selectsRange
            maxDate={null} // O puedes definir una fecha máxima
            onChangeDate={(date) => setEndDate(date)}
          />
        </div>
        <button type="submit" className={styles.searchButton}>
          <span className={styles.buttonText}>Search</span>
        </button>
      </div>
    </form>
  );
}
