import Modal from "react-modal";
import styles from "./selectedItinerary.module.css";
import Hours from "./flightDetailts/hours";
import HourStop from "./flightDetailts/hourStop";
import LogoAirline from "./flightDetailts/logoAirline";
import { airlineDescription } from "./flightDetailts/flightDescription";
import TravelerPricing from "./flightDetailts/travelerPricing";
import FlightAmenities from "./flightDetailts/FlightAmenities";
import { useNavigate } from "react-router-dom";


export default function SelectedItinerary({
  selectedItinerary,
  closeModal,
  departureHour,
  arrivalHour,
  itiner,
  isReturn,
  setIsReturn,
  searchData,
}) {
  const navigate = useNavigate();


  const handleSelectItinerary = () => {
    const dataToStore = {
      selectedItinerary,
      isReturn,
      //departureHour,
      //arrivalHour,
    };
    localStorage.setItem("storeData", JSON.stringify(dataToStore));
    navigate("/checkout");
  };

  const itineraryIndex = isReturn ? 1 : 0;

  return (
    <Modal
      isOpen={!!selectedItinerary}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      closeTimeoutMS={1000}
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={closeModal}
        aria-label="Close"
      >
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor" //Hereda el color del texto del padre
        >
          <path
            d="M6 6L18 18M6 18L18 6" //Comandos para dibujar la x
            stroke="blue" //Color de la linea
            strokeWidth="2" //Grosor de la linea
            strokeLinecap="round" //Extremos redondeados
            strokeLinejoin="round" //Uniones de linea suave
          />
        </svg>
      </button>
      <div className={styles.modalFlight}>
        <div>
          <div className={styles.modalHours}>
            <Hours
              departureHour={departureHour}
              arrivalHour={arrivalHour}
              itiner={selectedItinerary}
              customHoursLineClass={styles.lineCustom}
              itineraryIndex={itineraryIndex}
            />
            <div className={styles.parenthesis}>
              <span>(</span>
              <HourStop
                itiner={selectedItinerary}
                separator="-"
                itineraryIndex={itineraryIndex}
              />
              <span>)</span>
            </div>
          </div>
          <div className={styles.modalAirlines}>
            <div className={styles.logoModal}>
              <LogoAirline itiner={selectedItinerary} />
            </div>
            <p className={styles.airlines}>
              {airlineDescription(selectedItinerary)}
            </p>
          </div>
        </div>
        <div className={styles.amenitiesContainer}>
          <TravelerPricing itiner={selectedItinerary} />
          <FlightAmenities itiner={selectedItinerary} />
          <button
            type="submit"
            className={styles.selectedItineraryModal}
            onClick={handleSelectItinerary}
          >
            Select
          </button>
        </div>
      </div>
    </Modal>
  );
}
