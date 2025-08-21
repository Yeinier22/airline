import LogoAirline from "./flightDetailts/logoAirline";
import styles from "./checkout.module.css";
import { airlineDescription } from "./flightDetailts/flightDescription";
import { FlightContext } from "../utils/flightContext";
import { SearchDataContext } from "../hooks/searchData";
import { useContext, useState } from "react";
import { useFlightDescription } from "../hooks/useFlightDescription";

import ItinerarySegment from "../utils/itinerarySegment";


import { useNavigate } from "react-router-dom";
import FlightAmenities from "./flightDetailts/FlightAmenities";
import { useMediaQuery } from "react-responsive";

export default function Checkout() {
  const { setSearchData } = useContext(SearchDataContext);
  const { setFlightInformation } = useContext(FlightContext);
  const storedData = JSON.parse(localStorage.getItem("storeData")) || {};
  const { selectedItinerary} = storedData;
  const [showCheckout, setShowCheckout] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 990 });
  const flightInformationLocal = JSON.parse(
    localStorage.getItem("flightInformation")
  );
  const { depart, arrival } = useFlightDescription(
    false,
    flightInformationLocal
  );
  const price = selectedItinerary.price.grandTotal;
  const priceBase = selectedItinerary.price.base;
  const priceFee = (price - priceBase).toFixed(2);
  
  // Determinar si es un viaje de ida y vuelta
  const isRoundTrip = flightInformationLocal?.tripType === "Roundtrip" && 
                      flightInformationLocal?.dateReturn;

  const navigate = useNavigate();

  const handleChangeFlight = (isReturnFlight) => {
    setSearchData(true);
    setFlightInformation(flightInformationLocal);
    navigate("/", {
      state: {
        isReturnMode: isReturnFlight, // true si se quiere cambiar el vuelo de regreso
      },
    });
    //localStorage.removeItem("flightInformation");
  };

  if (!selectedItinerary || !flightInformationLocal?.dateDepart) {
    return <p>Loading...</p>; // o null
  }

  return (
    <div className={styles.container}>
      <div className={styles.itineraryContainer}>
        <ItinerarySegment
          depart={depart}
          arrival={arrival}
          selectedItinerary={selectedItinerary}
          handleChangeFlight={() => handleChangeFlight(false)} // departure
          flightInformationLocal={flightInformationLocal.dateDepart}
          value={0}
        ></ItinerarySegment>
        {isRoundTrip && (
          <ItinerarySegment
            depart={arrival}
            arrival={depart}
            selectedItinerary={selectedItinerary}
            handleChangeFlight={() => handleChangeFlight(true)} // return
            flightInformationLocal={flightInformationLocal.dateReturn}
            value={1}
          ></ItinerarySegment>
        )}
      </div>
      <div className={styles.checkoutContainer}>
        {(!isMobile || (isMobile && showCheckout)) && (
          <div className={styles.checkoutDescription}>
            <div className={styles.hiddenSummary}>
              <h2 className={styles.descriptionTitle}>Price summary</h2>
              {isMobile && showCheckout && (
                <button
                  type="button"
                  className={styles.collapseButton}
                  onClick={() => setShowCheckout(false)}
                >
                  <span>Hide summary</span> ⬇️
                </button>
              )}
            </div>
            <div className={styles.checkout}>
              <div className={styles.priceDescription}>
                <p>
                  <strong>
                    Traveler {flightInformationLocal.passengers} Adult
                  </strong>
                </p>
                <p>Flight</p>
                <p>Taxes, fees and charges</p>
              </div>
              <div className={styles.checkoutValues}>
                <p>
                  <strong>${price}</strong>
                </p>
                <p>${priceBase}</p>
                <p>${priceFee}</p>
              </div>
            </div>
          </div>
        )}
        <div className={styles.checkoutTotalContainer}>
          <div className={styles.checkoutTotalPrice}>
            <h3>Trip Total</h3>
            <p className={styles.checkoutPrice}>${price}</p>
            {isMobile && !showCheckout && (
              <button
                className={styles.deployPrice}
                onClick={() => setShowCheckout(true)}
              >
                <span className={styles.buttonText}>View price summary</span>
              </button>
            )}
          </div>
          {isMobile && showCheckout && (
            <p className={styles.checkoutNote}>
              Rates are quoted in US dollars
            </p>
          )}
          <button type="submit" className={styles.checkoutButton}>
            <span>Check out</span>
          </button>
        </div>
      </div>
      <div className={styles.checkoutAmenitiesContainer}>
        <div className={styles.segmentAmenitiesContainer}>
          <div className={styles.segmentAmenitiesAirline}>
            <p className={styles.itineraryLabel}>
              {depart} to {arrival}
            </p>
            <div className={styles.airlineDescription}>
              <div className={styles.logoModal}>
                <LogoAirline itiner={selectedItinerary} />
              </div>
              <p className={styles.airlines}>
                {airlineDescription(selectedItinerary)}
              </p>
            </div>
          </div>
          <FlightAmenities itiner={selectedItinerary} />
        </div>
        {isRoundTrip && (
          <div className={styles.segmentAmenitiesContainer}>
            <div className={styles.segmentAmenitiesAirline}>
              <p className={styles.itineraryLabel}>
                {arrival} to {depart}
              </p>
              <div className={styles.airlineDescription}>
                <div className={styles.logoModal}>
                  <LogoAirline itiner={selectedItinerary} />
                </div>
                <p className={styles.airlines}>
                  {airlineDescription(selectedItinerary)}
                </p>
              </div>
            </div>
            <FlightAmenities itiner={selectedItinerary} />
          </div>
        )}
      </div>
    </div>
  );
}
