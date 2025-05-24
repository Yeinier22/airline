import { Link } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { FlightContext } from "../utils/flightContext";
import { fetchFlightData } from "../utils/httpApi";
import data from "./data.json";
import styles from "./chooseFlight.module.css";
import { FlightCard } from "./flightCard";
import { FilterBy } from "./filterBy";
import { filterData } from "../utils/resultFilter";
import SearchAutocomplete from "./flightStatus/search-autocomplete";
import TwoMonthsRangePicker from "../utils/date";
import ExchangeInputs from "./flightStatus/exchange";
import { Book } from "./Book1";


export function ChooseFlight() {
  const { flightInformation, setFlightInformation } = useContext(FlightContext);
  const [filteredOffers, setFilteredOffers] = useState(data);
  const [itiner, setItiner] = useState(data);
  const [itiner2, setItiner2] = useState(data);
  const [airlines, setAirlines] = useState([]);
  const [changeAirline, setChangedAirline] = useState();
  const [airlineData, setAirlineData] = useState([]);
  const [filters, setFilters] = useState({
    nonStops: false,
    withStops: false,
    checkedAirlines: [],
  });
  const [uniqueOffers, setUniqueOffers] = useState(data);

  const findCheckedAirlines = (code) =>
    filters.checkedAirlines.find((itiner) => itiner.code === code)?.isChecked;

  const findCheckedStop = (typeStop) => filters[typeStop];

  // Actualiza los filtros para paradas
  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Actualiza los filtros para aerolíneas
  const toggleAirline = (code) => {
    setFilters((prev) => {
      const updatedAirlines = prev.checkedAirlines.some((a) => a.code === code)
        ? prev.checkedAirlines.map((a) =>
            a.code === code ? { ...a, isChecked: !a.isChecked } : a
          )
        : [...prev.checkedAirlines, { code, isChecked: true }];
      return { ...prev, checkedAirlines: updatedAirlines };
    });
  };

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

  const originLocationCode = flightInformation.departCity.label;
  const destinationLocationCode = flightInformation.returnCity.label;
  const departureDate = flightInformation.dateDepart;
  const returnDate = flightInformation.dateReturn;
  const adults = flightInformation.passengers;
  const currencyCode = flightInformation.currencyCode;
  const includedAirlineCodes = flightInformation.includedAirlineCodes;
  const nonStop = flightInformation.nonStop;

  //Generates unique data for offers
  const generateUniqueOffers = useMemo(() => {
    return data.filter(
      (offer, index, self) =>
        index ===
        self.findIndex(
          (o) =>
            o.price.grandTotal === offer.price.grandTotal &&
            o.itineraries[0].segments[0].carrierCode ===
              offer.itineraries[0].segments[0].carrierCode &&
            o.itineraries[0].segments[0].departure.iataCode ===
              offer.itineraries[0].segments[0].departure.iataCode &&
            o.itineraries[0].segments[0].arrival.iataCode ===
              offer.itineraries[0].segments[0].arrival.iataCode
        )
    );
  }, []);

  useEffect(() => {
    // Inicializa los datos únicos
    setUniqueOffers(generateUniqueOffers);
    setFilteredOffers(generateUniqueOffers);

    // Genera las aerolíneas disponibles
    const codeAirlines = [];
    generateUniqueOffers.forEach((offer) => {
      const code = offer.validatingAirlineCodes[0];
      if (!codeAirlines.some((airline) => airline.code === code)) {
        codeAirlines.push({ code, name: logAirlines[code], count: 0 });
      }
    });
    setAirlineData(codeAirlines);
  }, []);

  //Filtro cada vez que cambie el filtro de stop o de airlines
  //Add the itiner if in selectedAirlineCodes is include the carrier of this itine
  //Add the itiner if in selectedAirlineCodes is include the carrier of this itine
  //Con este filtro cambio las card
  useEffect(() => {
    //setAirlineData(getAirlineData)
    const result = filterData({
      data: uniqueOffers,
      selectedAirlines: filters.checkedAirlines,
      nonStops: filters.nonStops,
      withStops: filters.withStops,
    });
    setFilteredOffers(result);
  }, [filters, uniqueOffers]);

  useEffect(() => {
    //setAirlineData(getAirlineData)
    const result = filterData({
      data: uniqueOffers,
      selectedAirlines: [],
      nonStops: filters.nonStops,
      withStops: filters.withStops,
    });
    setAirlines(result);
  }, [filters.nonStops, filters.withStops, uniqueOffers]);


  //Va cambiando los datos con el que va a trabajar el menu de las aerolineas
  /*useEffect(() => {
     const result=filterFlights({data: uniqueOffers, isCheckedNonStop: filters.isCheckedNonStop, isCheckedWithStop:filters.isCheckedWithStop})
     setAirlines(result)
      //setAirlines(result)
    }, [ filters.isCheckedNonStop, filters.isCheckedWithStop]);*/

  ////padStart(2, '0'), Si la longitud no es 2, se le pone un 0 delante////
  ///debemos ponerlo con una condicion porque por ejemplo cuando volvemos
  ///a cargar la pagina en algun momento departureDate sera null o undefined,
  ///y dara error getFullYear, hasta que el useEffect de arriba se complete
  const departureDateFormatted = departureDate
    ? `${departureDate.getFullYear()}-${String(
        departureDate.getMonth() + 1
      ).padStart(2, "0")}-${String(departureDate.getDate()).padStart(2, "0")}`
    : null;
  const returnDateFormatted = returnDate
    ? `${returnDate.getFullYear()}-${String(returnDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(returnDate.getDate()).padStart(2, "0")}`
    : null;
  //const formattedStartDate = startDate.toISOString().split('T')[0];

  ////Filter 1 segment/////
  /*useEffect(() => {
    data
      //.filter((itine) => itine.itineraries[0].segments.length === 1)
      .filter((itine) => itine.itineraries[0].segments.length === 1);
    console.log(data);
  }, []);*/

  const logAirlines = {
    UA: "united",
    AC: "airCanada",
    NK: "spirit",
    F9: "Frontier",
    HA: "hawaiian",
    B6: "JetBlue",
  };

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}` +
            `&departureDate=${departureDateFormatted}&returnDate=${returnDateFormatted}&adults=${adults}&currencyCode=${currencyCode}` +
            `&includedAirlineCodes=${includedAirlineCodes}&nonStop=${nonStop}`
        );

        if (!response.ok) {
          throw new Error("Error fetching flight data");
        }

        const flightData = await response.json(); // Aquí puedes procesar la respuesta y usar los datos en tu aplicación
        return flightData;
      } catch (error) {
        console.error("Error:", error);
      }
    };
    //fetchFlightData();
  }, []);

  return (
    <div className={styles.container}>
      <Book />
      {/* <div className={styles.flightContainer}>
        <FilterBy
          itiner={airlines}
          itiner2={uniqueOffers}
          checkHandleStop={toggleFilter}
          isChecked={findCheckedStop}
          nonStop={filters.nonStop}
          withStop={filters.withStop}
          checkedAirlines={filters.checkedAirlines}
          setCheckedAirlines={toggleAirline}
          setChangedAirline={setChangedAirline}
          airlineData={airlineData}
          setAirlineData={setAirlineData}
          findCheckedAirlines={findCheckedAirlines}
        />
        <div>
          <h2>Choose flights</h2>
          <Link to={"/"}>New search</Link>
          <p>DEPART</p>
          <p>
            {flightInformation.departCity.details
              ? `${
                  flightInformation.departCity.details.airport.cityName
                    ? flightInformation.departCity.details.airport.cityName
                    : flightInformation.departCity.details.country
                }, ${
                  flightInformation.departCity.details.airport.state
                    ? flightInformation.departCity.details.region
                    : flightInformation.departCity.details.country
                } to  ${
                  flightInformation.returnCity.details.airport.cityName
                    ? flightInformation.returnCity.details.airport.cityName
                    : flightInformation.returnCity.details.country
                }, ${
                  flightInformation.returnCity.details.airport.state
                    ? flightInformation.returnCity.details.region
                    : flightInformation.returnCity.details.country
                }`
              : "loading..."}
          </p>
          <ul>
            {filteredOffers.map((itiner) => (
              <FlightCard key={itiner.id} itiner={itiner} />
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  );
}
