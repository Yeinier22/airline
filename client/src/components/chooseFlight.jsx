/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlightContext } from "../utils/flightContext";
import { SearchDataContext } from "../hooks/searchData";
import styles from "./chooseFlight.module.css";
import { FlightCard } from "./flightCard";
import { FilterBy } from "./filterBy";
import { filterData } from "../utils/resultFilter";
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
import { BACKEND_URL } from "../config";
import { detectCityName } from "../utils/geolocation";
import destData from "./destinations-data.json";
import destStyles from "./destinations.module.css";
import DestinationImage from "./DestinationImage";


export function ChooseFlight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReturnMode, resetSearch } = location.state || {};
  const { flightInformation, setFlightInformation } = useContext(FlightContext);
  const { searchData, setSearchData } = useContext(SearchDataContext);
  const [data, setData] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airlineData, setAirlineData] = useState([]);
  const [filters, setFilters] = useState({
    nonStops: false,
    withStops: false,
    checkedAirlines: [],
  });
  const [uniqueOffers, setUniqueOffers] = useState([]);
  const [isReturn, setIsReturn] = useState(() => isReturnMode || false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedDepartureHour, setSelectedDepartureHour] = useState(null);
  const [selectedArrivalHour, setSelectedArrivalHour] = useState(null);
  //const [returnOffers, setReturnOffers] = useState([]);
  const { depart, arrival } = useFlightDescription(false, flightInformation);
  const isMobile = useMediaQuery({ maxWidth: 990 });
  const [showDelayMessage, setShowDelayMessage] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null); // detected city (demo)

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

  /*useEffect(() => {
    const savedSearch = localStorage.getItem("searchData") === "true";
    if (savedSearch) {
      setSearchData(true);
    }
  }, []);*/

  useEffect(() => {
    if (location.state?.resetSearch) {
      // Aquí haces el reset de error y/o de los datos
      setSearchData(null);
      setError(null); // Si usas un estado de error
      // También puedes volver a ejecutar el fetch si es necesario
    }
  }, [location.state]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        if (parsed && parsed.length > 0) {
          setData(parsed);
        } else {
          // Si hay un valor vacío, lo eliminamos
          localStorage.removeItem("searchResults");
          setData([]);
          setSearchData(false);
        }
      } catch (e) {
        // Si falla el parseo, lo eliminamos también
        localStorage.removeItem("searchResults");
        setData([]);
        setSearchData(false);
      }
    } else {
      setData([]);
      setSearchData(false); // 🔥 Aquí evitas que se quede como true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  ///////////////////////////////////////////////////////

  // Detect user city once on mount (for proof-of-concept banner)
  useEffect(() => {
    let cancelled = false;
    detectCityName().then((name) => {
      if (!cancelled) setCity(name);
    });
    return () => {
      cancelled = true;
    };
  }, []);


  // Helpers for compact destinations grid
  const codeToCity = {
    MIA: "Miami",
    FLL: "Fort Lauderdale", 
    JFK: "New York",
    LGA: "New York",
    EWR: "Newark",
    ATL: "Atlanta",
    ORD: "Chicago",
    DFW: "Dallas",
    DEN: "Denver",
    SFO: "San Francisco",
    LAS: "Las Vegas",
    BOS: "Boston",
    SEA: "Seattle",
    IAH: "Houston",
    LAX: "Los Angeles",
    MCO: "Orlando"
  };

  // Map city names to IATA codes for filtering
  const cityToCode = {
    "Miami": "MIA",
    "Fort Lauderdale": "FLL",
    "New York": "NYC", // Use NYC as general code
    "Newark": "NYC",
    "Atlanta": "ATL", 
    "Chicago": "ORD",
    "Dallas": "DFW",
    "Denver": "DEN",
    "San Francisco": "SFO",
    "Las Vegas": "LAS",
    "Boston": "BOS",
    "Seattle": "SEA",
    "Houston": "IAH",
    "Los Angeles": "LAX",
    "Orlando": "MCO"
  };

  // Function to get filtered destinations (exclude current city)
  const getFilteredDestinations = () => {
    console.log("🏙️ Current detected city:", city);
    if (!city) return destData.slice(0, 12); // Show 12 if no geolocation
    
    const currentCityCode = cityToCode[city];
    console.log("✈️ Current city IATA code:", currentCityCode);
    if (!currentCityCode) return destData.slice(0, 12); // Show 12 if city not mapped
    
    // Filter out current city and return up to 12
    const filtered = destData.filter(dest => dest.iata !== currentCityCode);
    console.log("🎯 Total destinations:", destData.length);
    console.log("📍 Filtered destinations (excluding current city):", filtered.length);
    console.log("🎫 Showing destinations:", filtered.slice(0, 12).map(d => `${d.city} (${d.iata})`));
    return filtered.slice(0, 12);
  };
  // Función para generar fechas consistentes por destino
  const getDestinationDates = (iataCode) => {
    // Usar el código IATA como semilla para generar fechas consistentes
    const hash = iataCode.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const now = new Date();
    const weekOffset = Math.abs(hash) % 6; // 0-5 semanas
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekOffset * 7);
    const day = base.getDay();
    const toThu = (4 - day + 7) % 7;
    const start = new Date(base);
    start.setDate(base.getDate() + toThu);
    const end = new Date(start);
    end.setDate(start.getDate() + 2);
    return { departDate: start, returnDate: end };
  };

  // Función para formatear el rango de fechas para mostrar
  const formatDateRange = (departDate, returnDate) => {
    const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    return `${fmt(departDate)} - ${fmt(returnDate)}`;
  };
  const randPct = () => 10 + Math.floor(Math.random() * 61);

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

    // Para one-way, returnDate puede ser null
    const isOneWay = info.tripType === "One-way" || !returnDate;
    let returnDateFormatted = null;
    
    if (!isOneWay) {
      if (!(returnDate instanceof Date) || isNaN(returnDate.getTime())) {
        console.error("❌ returnDate is not a valid Date:", returnDate);
        return;
      }
      returnDateFormatted = formatDate(returnDate);
    }

    const departureDateFormatted = formatDate(departureDate);

    const fetchFlightData = async () => {
      setIsLoading(true);
      setShowDelayMessage(false);
      const delayTimer = setTimeout(() => setShowDelayMessage(true), 4000); // después de 4s
      try {
        // Construir URL base
        let apiUrl = `${BACKEND_URL}/?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}` +
            `&departureDate=${departureDateFormatted}&adults=${passengers}&currencyCode=${currencyCode}` +
            `&includedAirlineCodes=${includedAirlineCodes}&nonStop=${nonStop}`;
        
        // Solo agregar returnDate si es round trip
        if (!isOneWay && returnDateFormatted) {
          apiUrl += `&returnDate=${returnDateFormatted}`;
        }
        
        console.log("API URL:", apiUrl);
        const response = await fetch(apiUrl);
        clearTimeout(delayTimer);
        setIsLoading(false);

        if (!response.ok) {
          throw new Error("Error fetching flight data");
        }

        const flightData = await response.json();
        setData(flightData);
        localStorage.setItem("searchResults", JSON.stringify(flightData));
        return flightData;
      } catch (error) {
        clearTimeout(delayTimer); // detener mensaje de demora
        setIsLoading(false);
        setError("There was a problem loading flight data.");
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

  const handleDestinationClick = (destination) => {
    console.log("🎯 Destination card clicked:", destination);
    
    // Usar las mismas fechas que se muestran en la tarjeta (consistentes por destino)
    const { departDate, returnDate } = getDestinationDates(destination.iata);

    // Crear ciudad de origen (Miami por defecto) con estructura completa
    const originCity = {
      label: "MIA",
      details: {
        airport: {
          iataCode: "MIA",
          cityName: "Miami",
          state: "FL",
          country: "United States"
        }
      }
    };

    // Crear ciudad de destino desde el destino clickeado con estructura completa
    const destinationCity = {
      label: destination.iata,
      details: {
        airport: {
          iataCode: destination.iata,
          cityName: destination.city,
          state: destination.state || "",
          country: destination.country || "United States"
        }
      }
    };

    // Crear el objeto de información de vuelo
    const searchInfo = {
      departCity: originCity,
      returnCity: destinationCity,
      dateDepart: departDate,
      dateReturn: returnDate,
      passengers: 1,
      currencyCode: "USD",
      includedAirlineCodes: "UA,NK,AC,AS,B6,F9,HA,WN",
      nonStop: true,
      tripType: "Roundtrip", // Las destination cards siempre son round trip
    };

    console.log("Search info created:", searchInfo);

    // Actualizar el contexto y localStorage
    setFlightInformation(searchInfo);
    localStorage.setItem("flightInformation", JSON.stringify(searchInfo));

    // Ejecutar la búsqueda
    handleSearch(searchInfo);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      //setReturnOffers(offers);
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
      //setReturnOffers(savedOffers);
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
    return <Spinner showDelayMessage={showDelayMessage} />;
  }

  return (
    <div
      className={`${styles.chooseContainer} ${searchData ? styles.filter : ""}`}
    >
      {city && (
        <div style={{
          margin: "8px 0",
          padding: "6px 10px",
          background: "#eff6ff",
          color: "#1e3a8a",
          border: "1px solid #bfdbfe",
          borderRadius: 8,
          display: "inline-block"
        }}>
          Your location: <strong>{city}</strong>
        </div>
      )}
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
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}
      {searchData && !error && (
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
  {/* Hero image */}
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

      {/* Compact destinations grid under the hero image (home only) */}
      {!searchData && (
        <section className={destStyles.wrap} style={{paddingTop: 8, maxWidth: 1200, margin: '0 auto'}}>
          <div className={destStyles.headerRow}>
            <h3 style={{margin: 0}}>Popular Destinations</h3>
            <span className={destStyles.badge}>Demo data</span>
            <div style={{marginLeft: 'auto'}}>
              <Link to="/destinations">View all</Link>
            </div>
          </div>
          <div
            className={destStyles.grid}
            style={{ display: 'flex', flexDirection: 'row', gap: 16, overflowX: 'auto', paddingBottom: 8 }}
          >
            {getFilteredDestinations().map((d) => {
              const originCode = flightInformation?.departCity?.label || 'MIA';
              const originCity = codeToCity[originCode] || 'Your city';
              const stopText = d.nonStop ? '' : '+1';
              const { departDate, returnDate } = getDestinationDates(d.iata);
              const dateRange = formatDateRange(departDate, returnDate);
              return (
                <article 
                  key={d.iata} 
                  className={destStyles.card} 
                  style={{ minWidth: 340, maxWidth: 340, flexShrink: 0 }}
                  onClick={() => handleDestinationClick(d)}
                >
                  <div className={destStyles.meta}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <strong>{dateRange}</strong>
                      <span style={{background:'#0f766e', color:'#e7f7f4', borderRadius:8, padding:'2px 8px', fontSize:12}}>{randPct()}% off</span>
                    </div>
                    <div className={destStyles.rowBetween}>
                      <span style={{flex: 1, minWidth: 0}}><strong>{originCity} ({originCode}) → {d.city} ({d.iata})</strong></span>
                      {stopText && <span style={{color:'#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12, flexShrink: 0, marginLeft: 8}}>{stopText}</span>}
                    </div>
                  </div>
                  <div className={destStyles.thumbWrap}>
                    <DestinationImage 
                      images={d.heroImage} 
                      alt={`${d.city}, ${d.state}`}
                      interval={3000}
                      showIndicators={false}
                    />
                    <div className={destStyles.iata}>{d.iata}</div>
                  </div>
                  <div className={destStyles.meta}>
                    <div className={destStyles.tags}>
                      {d.tags?.slice(0,3).map((t) => (
                        <span key={t} className={destStyles.tag}>{t}</span>
                      ))}
                    </div>
                    <div className={destStyles.rowBetween}>
                      <span className={destStyles.price}>From ${d.samplePrice} <em>(demo)</em></span>
                      <span className={destStyles.pop}>★ {d.popularity}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
