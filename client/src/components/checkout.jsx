import { useLocation } from "react-router-dom";
import LogoAirline from "./flightDetailts/logoAirline";
import styles from "./checkout.module.css";
import { airlineDescription } from "./flightDetailts/flightDescription";
import { FlightContext } from "../utils/flightContext";
import { SearchDataContext } from "../hooks/searchData";
import { useContext, useEffect, useState } from "react";
import { useFlightDescription } from "../hooks/useFlightDescription";
import Hours from "./flightDetailts/hours";
import HourStop from "./flightDetailts/hourStop";
import ItinerarySegment from "../utils/itinerarySegment";
import { formatDateString } from "../utils/formatDate";

import { useNavigate } from "react-router-dom";
import FlightAmenities from "./flightDetailts/FlightAmenities";
import { useMediaQuery } from "react-responsive";

export default function Checkout() {
  const { setSearchData } = useContext(SearchDataContext);
  const { setFlightInformation } = useContext(FlightContext);
  const storedData = JSON.parse(localStorage.getItem("storeData")) || {};
  const { selectedItinerary, isReturn } = storedData;
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

  const navigate = useNavigate();

  const handleChangeFlight = (isReturnFlight) => {
    setSearchData(true);
    setFlightInformation(flightInformationLocal);
    navigate("/", {
      state: {
        isReturnMode: isReturnFlight,
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
          handleChangeFlight={handleChangeFlight}
          flightInformationLocal={flightInformationLocal.dateDepart}
          value={0}
          isReturn={false}
        ></ItinerarySegment>
        <ItinerarySegment
          depart={arrival}
          arrival={depart}
          selectedItinerary={selectedItinerary}
          handleChangeFlight={handleChangeFlight}
          flightInformationLocal={flightInformationLocal.dateReturn}
          value={1}
          isReturn={true}
        ></ItinerarySegment>
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
      </div>
    </div>
  );
}
