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
import PassengerForm from "./PassengerForm";
import PaymentForm from "./PaymentForm";

export default function Checkout() {
  const { setSearchData } = useContext(SearchDataContext);
  const { setFlightInformation } = useContext(FlightContext);
  const storedData = JSON.parse(localStorage.getItem("storeData")) || {};
  const { selectedItinerary } = storedData;
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Review, 2: Passenger, 3: Payment
  const [passengerData, setPassengerData] = useState(null);
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
  const isRoundTrip =
    flightInformationLocal?.tripType === "Roundtrip" &&
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

  const handlePassengerSubmit = (data) => {
    setPassengerData(data);
    setCurrentStep(3); // Go to payment step
  };

  const handlePaymentSuccess = (bookingConfirmation) => {
    // Navigate to confirmation page
    navigate("/booking-confirmation");
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    // Handle payment error (show message, etc.)
  };

  const goBackToPassenger = () => {
    setCurrentStep(2);
  };

  const goBackToReview = () => {
    setCurrentStep(1);
  };

  if (!selectedItinerary || !flightInformationLocal?.dateDepart) {
    return <p>Loading...</p>; // o null
  }

  // Flight Summary Component
  const FlightSummary = ({
    flightInformation,
    depart,
    arrival,
    price,
    priceBase,
    priceFee,
    isRoundTrip,
  }) => {
    const [activeTab, setActiveTab] = useState("outbound");

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return (
      <div className={styles.flightSummary}>
        {isRoundTrip && (
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${
                activeTab === "outbound" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("outbound")}
            >
              {depart} - {arrival}
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "return" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("return")}
            >
              {arrival} - {depart}
            </button>
          </div>
        )}

        <div className={styles.flightCard}>
          <div className={styles.flightDate}>
            {activeTab === "outbound" || !isRoundTrip
              ? formatDate(flightInformation.dateDepart)
              : formatDate(flightInformation.dateReturn)}
          </div>

          <div className={styles.flightRoute}>
            <div className={styles.flightTime}>
              <span className={styles.time}>8:51 AM</span>
              <span className={styles.duration}>3h 15m</span>
              <span className={styles.time}>12:06 PM</span>
            </div>

            <div className={styles.routeInfo}>
              <div className={styles.airports}>
                <span className={styles.airportCode}>
                  {activeTab === "outbound" || !isRoundTrip
                    ? depart.substring(0, 3)
                    : arrival.substring(0, 3)}
                </span>
                <div className={styles.routeLine}>
                  <div className={styles.airplane}>✈</div>
                </div>
                <span className={styles.airportCode}>
                  {activeTab === "outbound" || !isRoundTrip
                    ? arrival.substring(0, 3)
                    : depart.substring(0, 3)}
                </span>
              </div>
              <div className={styles.cities}>
                <span>
                  {activeTab === "outbound" || !isRoundTrip ? depart : arrival}
                </span>
                <span>
                  {activeTab === "outbound" || !isRoundTrip ? arrival : depart}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.flightDetails}>
            <div className={styles.flightNumber}>
              <span className={styles.airline}>🛩 AA 2247 • Main Cabin</span>
            </div>
          </div>
        </div>

        <div className={styles.costSummary}>
          <h3>Cost summary</h3>
          <div className={styles.costRow}>
            <span>Basic Economy x 1</span>
            <span>${priceBase}</span>
          </div>
          <div className={styles.costRow}>
            <span>Taxes and carrier imposed fees</span>
            <span>${priceFee}</span>
          </div>
          <div className={styles.costTotal}>
            <span>Total fare</span>
            <span>${price}</span>
          </div>
          <div className={styles.totalAmount}>
            <span>Total amount due</span>
            <span className={styles.finalPrice}>${price}</span>
          </div>
          <div className={styles.allPassengers}>(All passengers)</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {currentStep === 1 && (
        <>
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
                    <span className={styles.buttonText}>
                      View price summary
                    </span>
                  </button>
                )}
              </div>
              {isMobile && showCheckout && (
                <p className={styles.checkoutNote}>
                  Rates are quoted in US dollars
                </p>
              )}
              <button
                type="button"
                className={styles.checkoutButton}
                onClick={() => setCurrentStep(2)}
              >
                <span>Continue to Passenger Info</span>
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
        </>
      )}

      {currentStep === 2 && (
        <div className={styles.formWithSummary}>
          <div className={styles.formSection}>
            <button onClick={goBackToReview} className={styles.backButton}>
              ← Back to Review
            </button>
            <PassengerForm
              onSubmit={handlePassengerSubmit}
              defaultValues={passengerData}
            />
          </div>
          <div className={styles.summarySection}>
            <FlightSummary
              flightInformation={flightInformationLocal}
              depart={depart}
              arrival={arrival}
              price={price}
              priceBase={priceBase}
              priceFee={priceFee}
              isRoundTrip={isRoundTrip}
            />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className={styles.formWithSummary}>
          <div className={styles.formSection}>
            <button onClick={goBackToPassenger} className={styles.backButton}>
              ← Back to Passenger Info
            </button>
            <PaymentForm
              amount={parseFloat(price)}
              currency="USD"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              passengerData={passengerData}
              flightData={{
                departure: {
                  city: depart,
                  code: flightInformationLocal.departCity?.label,
                },
                arrival: {
                  city: arrival,
                  code: flightInformationLocal.returnCity?.label,
                },
                departDate: flightInformationLocal.dateDepart,
                returnDate: flightInformationLocal.dateReturn,
                isRoundTrip,
              }}
            />
          </div>
          <div className={styles.summarySection}>
            <FlightSummary
              flightInformation={flightInformationLocal}
              depart={depart}
              arrival={arrival}
              price={price}
              priceBase={priceBase}
              priceFee={priceFee}
              isRoundTrip={isRoundTrip}
            />
          </div>
        </div>
      )}
    </div>
  );
}
