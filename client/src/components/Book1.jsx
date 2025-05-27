import { useEffect, useState } from "react";
//import { get } from "../utils/httpApi";
import SearchAutocomplete from "./flightStatus/search-autocomplete";
import { buildIndex } from "./flightStatus/airportsMap";
import locations from "./flightStatus/airports.json";
import TwoMonthsPicker1 from "../utils/dateRange";
import { max } from "lodash";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FlightContext } from "../utils/flightContext";
import ExchangeInputs from "./flightStatus/exchange";
import styles from "./Book1.module.css";
import NumPassenger from "./flightStatus/numPassenger";
import TripSelector from "./flightStatus/tripTypeSelector";
import { useMediaQuery } from "react-responsive";

export function Book({
  setSearchData,
  searchData,
  setUniqueOffers,
  data,
  handleSearch,
  setShowBook,
}) {
  const [ctdadPassenger, setCtdadPassenger] = useState(1);
  const [index, setIndex] = useState(null);
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const end = new Date();
  end.setDate(end.getDate() + 4);
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  const { setFlightInformation, flightInformation } = useContext(FlightContext);

  const [secondRange, setSecondRange] = useState(false); //Para el comportamiento del rango de fechas
  const [customError, setCustomError] = useState("");
  const [error, setError] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 990 });
  const emptyCity = { label: "", details: null };

  const [formState, setFormState] = useState({
    departCity: flightInformation.departCity || emptyCity,
    returnCity: flightInformation.returnCity || emptyCity,
  });


  useEffect(() => {
    const builtIndex = buildIndex(locations);
    setIndex(builtIndex);
  }, []);

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
      // se detectó una recarga manual, resetear el estado
      //localStorage.removeItem("storeData");
      //setSearchData(false);
      sessionStorage.removeItem("manualReload"); // Limpiar la bandera de recarga
      localStorage.removeItem("flightInformation");
      localStorage.removeItem("returnOffers");
      localStorage.removeItem("searchResults");
      localStorage.removeItem("searchData");
      setSearchData(false);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignora la hora, solo compara fechas

    if (savedFlightInformation) {
      const depDate = new Date(savedFlightInformation.dateDepart);
      const retDate = new Date(savedFlightInformation.dateReturn);

      const isDepPast = depDate < today;
      const isRetPast = retDate < today;

      if (isDepPast || isRetPast) {
        // ⚠️ Fechas caducadas, las reemplazamos con nuevas válidas
        const newStart = new Date();
        newStart.setDate(newStart.getDate() + 1);
        const newEnd = new Date();
        newEnd.setDate(newEnd.getDate() + 4);

        const updated = {
          ...savedFlightInformation,
          dateDepart: newStart,
          dateReturn: newEnd,
        };

        setFlightInformation(updated);
        localStorage.setItem("flightInformation", JSON.stringify(updated));
        setStartDate(newStart);
        setEndDate(newEnd);
        setCtdadPassenger(updated.passengers || 1);
      } else {
        // ✅ Fechas válidas, usamos las del storage
        setFlightInformation(savedFlightInformation);
        setStartDate(depDate);
        setEndDate(retDate);
        setCtdadPassenger(savedFlightInformation.passengers || 1);
      }
    }
  }, []);

  useEffect(() => {
    if (
      !flightInformation.departCity.label ||
      !flightInformation.returnCity.label
    ) {
      setCustomError("Both departure and return locations must be filled.");
    }
    if (
      flightInformation.departCity.label ===
        flightInformation.returnCity.label &&
      flightInformation.departCity.label
    ) {
      setCustomError("Locations cannot be the same");
      setError(true);
    } else {
      setCustomError(""); // Limpia el error si todo está bien
      setError(false);
    }
  }, [flightInformation.departCity.label, flightInformation.returnCity.label]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🧾 SUBMIT INFO:");
console.log("formState.departCity:", formState.departCity);
console.log("formState.returnCity:", formState.returnCity);
    const updatedFlightInformation = {
      ...flightInformation,
      departCity: formState.departCity,
      returnCity: formState.returnCity,
      dateDepart: startDate,
      dateReturn: endDate,
      passengers: ctdadPassenger,
      currencyCode: flightInformation.currencyCode || "USD",
      includedAirlineCodes: "UA,NK,AC,AS,B6,F9,HA,WN",
      nonStop: true,
    };
    console.log("📦 updatedFlightInformation:", updatedFlightInformation);
    // Actualiza el contexto y localStorage antes de navegar
    setFlightInformation(updatedFlightInformation);
    localStorage.setItem(
      "flightInformation",
      JSON.stringify(updatedFlightInformation)
    );
    const savedFlightInformation1 = JSON.parse(
      localStorage.getItem("flightInformation")
    );
    handleSearch(updatedFlightInformation);
  };

  useEffect(() => {
    // Solo si no hay fechas guardadas
    if (
      !flightInformation.dateDepart ||
      !flightInformation.dateReturn ||
      !(flightInformation.dateDepart instanceof Date)
    ) {
      const updated = {
        ...flightInformation,
        dateDepart: startDate,
        dateReturn: endDate,
        passengers: ctdadPassenger,
        currencyCode: flightInformation.currencyCode || "USD",
        includedAirlineCodes: "UA,NK,AC,AS,B6,F9,HA,WN",
        nonStop: true,
      };

      setFlightInformation(updated);
      localStorage.setItem("flightInformation", JSON.stringify(updated));
    }
  }, []);

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div
      className={`${styles.chooseContainer} ${searchData ? styles.filter : ""}`}
    >
      {!searchData && (
        <div className={styles.chooseTitle}>
          <h1>BOOK A FLIGHT</h1>
          <div className={styles.chooseTitleBorder}></div>
        </div>
      )}
      <form
        className={`${styles.formContainer} ${styles.filter}`}
        onSubmit={handleSubmit}
      >
        <TripSelector />
        <div className={styles.flightSearch}>
          <div className={styles.searchContainer}>
            <div className={styles.searchAutocomplete}>
              <SearchAutocomplete
                key={formState.departCity.label + "-depart"}
                className={styles.iataCode}
                index={index}
                onSearchChange={(newCity) => {
                  console.log("✏️ newCity:", newCity);
                  setFormState((prev) => ({
                    ...prev,
                    departCity:
                      newCity && newCity.airport
                        ? { label: newCity.airport.iataCode, details: newCity }
                        : { label: "", details: null },
                       
                  }));
                }}
                initialValue={formState.departCity.label}
                place="Leaving to"
              />
              {/* Display custom error if `return` and `depart` are the same */}
              {customError && (
                <p
                  style={{ color: "red", fontSize: "14px" }}
                  className={styles.searchError}
                >
                  {customError}
                </p>
              )}
            </div>
            <ExchangeInputs
              error={error}
              formState={formState}
              setFormState={setFormState}
            />
            <div className={styles.searchAutocomplete}>
              <SearchAutocomplete
                key={formState.returnCity.label + "-return"}
                className={styles.iataCode}
                index={index}
                onSearchChange={(newCity) => {
                  setFormState((prev) => ({
                    ...prev,
                    returnCity:
                      newCity && newCity.airport
                        ? { label: newCity.airport.iataCode, details: newCity }
                        : { label: "", details: null },
                  }));
                }}
                initialValue={formState.returnCity.label}
                place="Going to"
              />
              {/* Display custom error if `return` and `depart` are the same */}
              {customError && (
                <p
                  style={{ color: "red", fontSize: "14px" }}
                  className={styles.searchError}
                >
                  {customError}{" "}
                </p>
              )}
            </div>
          </div>
          <TwoMonthsPicker1
            minDate={new Date()}
            start={startDate}
            startDate={startDate}
            setStartDate={setStartDate}
            //maxDate={maxDate}
            endDate={endDate}
            onChangeDate={(dates) => {
              const [start, end] = dates;
              if (endDate && start > endDate && secondRange === false) {
                setEndDate(start);
                setSecondRange(!secondRange);
              } else if (endDate && start < startDate) {
                setStartDate(start);
                const newEndDate = new Date(start);
                newEndDate.setDate(newEndDate.getDate() + 1);
                setEndDate(newEndDate);
                setSecondRange(false);
              } else {
                setStartDate(start);
                setEndDate(end);
                setSecondRange(false);
              }
            }}
          />
          <NumPassenger />
          <div>
            <button type="submit" className={styles.searchButton}>
              <span className={styles.buttonText}>Search</span>
            </button>
          </div>
        </div>
      </form>
      {isMobile && searchData && (
        <button
          type="submit"
          className={styles.buttonCloseBook}
          onClick={() => setShowBook(false)}
        >
          Close
        </button>
      )}
    </div>
  );
}
