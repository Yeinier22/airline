import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlightContext } from "../utils/flightContext";
import { SearchDataContext } from "../hooks/searchData";
import { fetchFlightData } from "../utils/httpApi";
import styles from "./chooseFlight.module.css";
import { FlightCard } from "./flightCard";
import { FilterBy } from "./filterBy";
import { filterData } from "../utils/resultFilter";
import SearchAutocomplete from "./flightStatus/search-autocomplete";
import TwoMonthsRangePicker from "../utils/date";
import ExchangeInputs from "./flightStatus/exchange";
import { Book } from "./Book1";
import SelectedItinerary from "./selectedItinerary";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { formatDateString } from "../utils/formatDate";
import { useFlightDescription } from "../hooks/useFlightDescription";
import { useMediaQuery } from "react-responsive";
import { Spinner } from "./Spinner";

export function ChooseFlight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReturnMode, resetSearch } = location.state || {};
  const { flightInformation, setFlightInformation } = useContext(FlightContext);
  const { searchData, setSearchData } = useContext(SearchDataContext);
  const [data, setData] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [changeAirline, setChangedAirline] = useState();
  const [airlineData, setAirlineData] = useState([]);
  const [filters, setFilters] = useState({
    nonStops: false,
    withStops: false,
    checkedAirlines: [],
  });
  const [uniqueOffers, setUniqueOffers] = useState([]);
  const [isReturn, setIsReturn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedDepartureHour, setSelectedDepartureHour] = useState(null);
  const [selectedArrivalHour, setSelectedArrivalHour] = useState(null);
  const [returnOffers, setReturnOffers] = useState([]);
  const { depart, arrival } = useFlightDescription(false, flightInformation);
  const isMobile = useMediaQuery({ maxWidth: 990 });

  const findCheckedAirlines = (code) => filters.checkedAirlines.includes(code);

  const findCheckedStop = (typeStop) => filters[typeStop];


  // Actualiza los filtros para paradas
  const toggleFilter = (filterName) =>
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));

  // Actualiza los filtros para aerolíneas
  const toggleAirline = (code) => {
    setFilters((prev) => ({
      ...prev,
      checkedAirlines: prev.checkedAirlines.includes(code)
        ? prev.checkedAirlines.filter((c) => c !== code) //  Quita si ya está seleccionado
        : [...prev.checkedAirlines, code], // Agrega si no está seleccionado
    }));
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("searchData") === "true";
    if (savedSearch) {
      setSearchData(true);
    }
  }, []);

  useEffect(() => {
    if (resetSearch) {
      setSearchData(false); // Oculta resultados
      setUniqueOffers([]); // Borra ofertas cargadas
      setFilteredOffers([]);
      setIsReturn(false); // Vuelve a modo "ida"
      localStorage.removeItem("returnOffers");
      // Puedes opcionalmente resetear filters aquí también si quieres
      localStorage.removeItem("returnOffers");
      localStorage.removeItem("searchResults");
      navigate(location.pathname, { replace: true });
    }
  }, [location.key]);

  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (storedResults) {
      const parsed = JSON.parse(storedResults);
      setData(parsed);
    }
  }, []);

  /////Obtenemos los valores del localstorage porque si lo obtenemos del context,
  ///en el primer renderizado, estara bien, pero si vuelvo a cargar la pagina los valores
  //se perderan y iniciaran, ademas los valores de localStorage vienen como un string
  //por lo  que dateDepart y dateReturn hay que volverlos a convertir en obj date para que
  //mas abajo getFullYear() no de error
  useEffect(() => {
    const savedFlightInformation = JSON.parse(
      localStorage.getItem("flightInformation")
    );
    if (savedFlightInformation) {
      // Convert date strings back into Date objects
      setFlightInformation({
        ...savedFlightInformation,
        dateDepart: new Date(savedFlightInformation.dateDepart),
        dateReturn: savedFlightInformation.dateReturn
          ? new Date(savedFlightInformation.dateReturn)
          : null,
      });
    }
  }, []);
  ///////////////////////////////////////////////////////

  const handleSearch = async (info = flightInformation) => {
    const {
      departCity,
      returnCity,
      dateDepart,
      dateReturn,
      passengers,
      currencyCode,
      includedAirlineCodes,
      nonStop,
    } = info;

    console.log("🚀 handleSearch called with:", info);
console.log("originLocationCode:", info.departCity?.label);
console.log("destinationLocationCode:", info.returnCity?.label);

    const originLocationCode = departCity.label;
    const destinationLocationCode = returnCity.label;

    const departureDate = new Date(dateDepart);
    const returnDate = new Date(dateReturn);

    if (!(departureDate instanceof Date) || isNaN(departureDate.getTime())) {
      console.error("❌ departureDate is not a valid Date:", departureDate);
      return;
    }

    if (!(returnDate instanceof Date) || isNaN(returnDate.getTime())) {
      console.error("❌ returnDate is not a valid Date:", returnDate);
      return;
    }

    const departureDateFormatted = formatDate(departureDate);
    const returnDateFormatted = formatDate(returnDate);

    const fetchFlightData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}` +
            `&departureDate=${departureDateFormatted}&returnDate=${returnDateFormatted}&adults=${passengers}&currencyCode=${currencyCode}` +
            `&includedAirlineCodes=${includedAirlineCodes}&nonStop=${nonStop}`
        );
        setIsLoading(false);

        if (!response.ok) {
          throw new Error("Error fetching flight data");
        }

        const flightData = await response.json();
        setData(flightData);
        localStorage.setItem("searchResults", JSON.stringify(flightData));
        return flightData;
      } catch (error) {
        console.error("Error:", error);
        return [];
      }
    };

    const result = await fetchFlightData();
    setIsReturn(false);
    setSearchData(true);
    localStorage.setItem("searchData", "true");

    if (result.length > 0) {
      const unique = generateUniqueOffersFromData(result);
      setUniqueOffers(unique);
    }
  };

  const generateUniqueOffersFromData = (rawData) => {
    return rawData.filter((offer, index, self) => {
      const haveStop = offer.itineraries[0].segments.length > 1;
      return (
        index ===
        self.findIndex((o) => {
          const oHaveStop = o.itineraries[0].segments.length > 1;
          return (
            o.itineraries[0].segments[0].carrierCode ===
              offer.itineraries[0].segments[0].carrierCode &&
            o.itineraries[0].segments[0].departure.iataCode ===
              offer.itineraries[0].segments[0].departure.iataCode &&
            o.itineraries[0].segments[0].arrival.iataCode ===
              offer.itineraries[0].segments[0].arrival.iataCode &&
            o.itineraries[0].segments[0].departure.at ===
              offer.itineraries[0].segments[0].departure.at &&
            (oHaveStop
              ? o.itineraries[0].segments[1].arrival.at
              : o.itineraries[0].segments[0].arrival.at) ===
              (haveStop
                ? offer.itineraries[0].segments[1].arrival.at
                : offer.itineraries[0].segments[0].arrival.at)
          );
        })
      );
    });
  };

  const generateArrivalOptions = useMemo(() => {
    return data.reduce((acc, offer) => {
      const haveStop = offer.itineraries[0].segments.length > 1;
      const arrivalHour = haveStop
        ? offer.itineraries[0].segments[1].arrival.at
        : offer.itineraries[0].segments[0].arrival.at;
      const departureHour = offer.itineraries[0].segments[0].departure.at;

      const key = `${offer.itineraries[0].segments[0].carrierCode}-${formatTime(
        departureHour
      )}-${formatTime(arrivalHour)}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(offer); // Agrega todas las opciones de llegada
      return acc;
    }, {});
  }, [data]);

  useEffect(() => {
    if (data.length === 0) return; // evita ejecutar si no hay datos aún

    const unique = generateUniqueOffersFromData(data);
    setUniqueOffers(unique);

    // Genera las aerolíneas disponibles a partir de unique
    const codeAirlines = [];
    unique.forEach((offer) => {
      const code = offer.validatingAirlineCodes[0];
      if (!codeAirlines.some((airline) => airline.code === code)) {
        codeAirlines.push({ code, name: logAirlines[code], count: 0 });
      }
    });

    setAirlineData(codeAirlines);
  }, [data]);

  //Filtro cada vez que cambie el filtro de stop o de airlines
  //Add the itiner if in selectedAirlineCodes is include the carrier of this itine
  //Add the itiner if in selectedAirlineCodes is include the carrier of this itine
  //Con este filtro cambio las card
  const itineraryIndex = isReturn ? 1 : 0;

  useEffect(() => {
    if (!isReturn) {
      const result = filterData({
        data: uniqueOffers,
        selectedAirlines: filters.checkedAirlines,
        nonStops: filters.nonStops,
        withStops: filters.withStops,
        itineraryIndex,
        isReturn,
      });
      setFilteredOffers(result);
    }
  }, [filters, uniqueOffers]);

  useEffect(() => {
    //setAirlineData(getAirlineData)
    const result = filterData({
      data: uniqueOffers,
      selectedAirlines: [],
      nonStops: filters.nonStops,
      withStops: filters.withStops,
      itineraryIndex,
      isReturn,
    });
    setAirlines(result);
  }, [filters.nonStops, filters.withStops, uniqueOffers]);

  //Va cambiando los datos con el que va a trabajar el menu de las aerolineas
  /*useEffect(() => {
     const result=filterFlights({data: uniqueOffers, isCheckedNonStop: filters.isCheckedNonStop, isCheckedWithStop:filters.isCheckedWithStop})
     setAirlines(result)
      //setAirlines(result)
    }, [ filters.isCheckedNonStop, filters.isCheckedWithStop]);*/

  const logAirlines = {
    UA: "United Airlines",
    AC: "Air Canada",
    NK: "Spirit Airlines",
    F9: "Frontier Airlines",
    HA: "Hawaiian Airlines",
    B6: "JetBlue Airways",
    AS: "Alaska Airlines",
    WN: "Southwest Airlines",
  };

  const handleClick = (itiner, departureHour, arrivalHour) => {
    //setSelectedItinerary(itiner);
    setSelectedDepartureHour(departureHour);
    setSelectedArrivalHour(arrivalHour);

    if (!isReturn) {
      const oneWayKey = `${
        itiner.itineraries[0].segments[0].carrierCode
      }-${formatTime(departureHour)}-${formatTime(arrivalHour)}`;

      const offers = generateArrivalOptions[oneWayKey] || [];
      setIsReturn(true);
      setUniqueOffers(offers);
      setFilteredOffers(offers);
      setReturnOffers(offers);
      localStorage.setItem("returnOffers", JSON.stringify(offers));
    } else {
      setSelectedItinerary(itiner);
    }
  };

  useEffect(() => {
    const savedOffers = JSON.parse(localStorage.getItem("returnOffers"));
    if (isReturnMode && savedOffers && savedOffers.length > 0) {
      setIsReturn(true);
      setFilteredOffers(savedOffers);
      setUniqueOffers(savedOffers);
      setReturnOffers(savedOffers);
    }
  }, [isReturnMode]);

  const closeModal = () => {
    setSelectedItinerary(null); // Cierra el modal
  };

  const handleChangeFlight = () => {
    setIsReturn(false);
    //setUniqueOffers(generateUniqueOffers);
    setFilteredOffers(generateUniqueOffersFromData(data));
    setUniqueOffers(generateUniqueOffersFromData(data));
    /*setFilters({
      nonStops: false,
      withStops: false,
      checkedAirlines: [], // 🔥 Reseteamos los filtros para que no eliminen opciones
    });*/
  };

  //if (!isReady) return null;

  const [showFilter, setShowFilter] = useState(false);
  const [showBook, setShowBook] = useState(false);

  //This is another way//
  /*const [isMobile, setIsMobile] = useState(window.innerWidth < 990);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 990);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);*/

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div
      className={`${styles.chooseContainer} ${searchData ? styles.filter : ""}`}
    >
      {isMobile && searchData && !showBook ? (
        <button
          onClick={() => setShowBook(true)}
          className={styles.expandSearchBook}
        >
          <p>
            {depart} to {arrival}
          </p>
          <p>
            {" "}
            {formatDateString(flightInformation.dateDepart)} -{" "}
            {formatDateString(flightInformation.dateReturn)}
          </p>
        </button>
      ) : (
        <Book
          setSearchData={setSearchData}
          handleSearch={handleSearch}
          searchData={searchData}
          setUniqueOffers={setUniqueOffers}
          data={data}
          setShowBook={setShowBook}
        />
      )}
      {searchData && (
        <div className={styles.flightContainer}>
          {isMobile ? (
            <>
              <button
                onClick={() => setShowFilter(true)}
                className={styles.sortFilterButton}
              >
                <FontAwesomeIcon icon={faSliders} size="lg" color="#2563eb" />{" "}
                Sort & Filter
              </button>

              {showFilter && (
                <div className={styles.modalOverlay}>
                  <div
                    className={styles.modalContent}
                    onClick={(e) => e.stopPropagation()} // evita que se cierre al hacer clic dentro del modal
                  >
                    <FilterBy
                      itiner={airlines}
                      itiner2={uniqueOffers}
                      checkHandleStop={toggleFilter}
                      isChecked={findCheckedStop}
                      checkedAirlines={filters.checkedAirlines}
                      setCheckedAirlines={toggleAirline}
                      setChangedAirline={setChangedAirline}
                      airlineData={airlineData}
                      setAirlineData={setAirlineData}
                      findCheckedAirlines={findCheckedAirlines}
                      isReturn={isReturn}
                      isMobile={isMobile}
                    />
                    <button
                      onClick={() => setShowFilter(false)}
                      className={styles.buttonCloseSort}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <FilterBy
              itiner={airlines}
              itiner2={uniqueOffers}
              checkHandleStop={toggleFilter}
              isChecked={findCheckedStop}
              checkedAirlines={filters.checkedAirlines}
              setCheckedAirlines={toggleAirline}
              setChangedAirline={setChangedAirline}
              airlineData={airlineData}
              setAirlineData={setAirlineData}
              findCheckedAirlines={findCheckedAirlines}
              isReturn={isReturn}
              isMobile={isMobile}
            />
          )}
          <div className={styles.chooseFlight}>
            <h2>{isReturn ? "Returning Flights" : "Departing Flights"}</h2>
            <ul className={styles.flightCard}>
              {filteredOffers.map((itiner) => (
                <FlightCard
                  key={itiner.id}
                  itiner={itiner}
                  flightInformation={flightInformation}
                  onClick={handleClick}
                  isReturn={isReturn}
                  handleChangeFlight={handleChangeFlight}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      {selectedItinerary && (
        <SelectedItinerary
          selectedItinerary={selectedItinerary}
          closeModal={closeModal}
          departureHour={selectedDepartureHour}
          arrivalHour={selectedArrivalHour}
          searchData={searchData}
          isReturn={isReturn}
          setIsReturn={setIsReturn}
        />
      )}
      <div>
        {!searchData && (
          <img
            src="./images/flight.jpg"
            alt="plane in flight"
            className={styles.airplane}
          />
        )}
      </div>
    </div>
  );
}
