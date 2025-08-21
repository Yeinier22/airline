import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./dateRange.module.css";
import "./styles.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function TwoMonthsPicker1({
  minDate,
  start,
  startDate,
  endDate,
  maxDate,
  onChangeDate,
  tripType = "Roundtrip", // Nueva prop para el tipo de viaje
}) {
  const [placement, setPlacement] = useState("bottom-start");
  const calRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1015) {
        setPlacement("bottom-start"); // Posición para pantallas grandes
      } else {
        setPlacement("top-start"); // Posición para pantallas pequeñas
      }
    };

    // Ejecutar la función inicialmente para establecer el valor correcto
    handleResize();

    // Escuchar el evento de cambio de tamaño de pantalla
    window.addEventListener("resize", handleResize);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Formatear fechas como "Jan-3"
  const formatDate = (date) =>
    date
      ? date
          .toLocaleDateString("en-US", { month: "short", day: "numeric" })
          .replace(",", "")
      : "";

  const [shouldCloseOnSelect, setShouldCloseOnSelect] = useState(false);
  //const calRef = useRef(null); // Crea una referencia al DatePicker

  const handleClick = (e) => {
    e.preventDefault();
    setShouldCloseOnSelect(true); // Actualiza el estado
    if (calRef.current) {
      // Llama al método de cierre si el ref está disponible
      calRef.current.setOpen(false);
    }
  };

  return (
      <DatePicker
        ref={calRef}
        customInput={<CustomInput formatDate={formatDate} tripType={tripType} />}
        placeholderText="Dates"
        onChange={onChangeDate}
        shouldCloseOnSelect={shouldCloseOnSelect}
        onSelect={() => setShouldCloseOnSelect(false)}
        renderCustomHeader={({
          monthDate,
          customHeaderCount,
          decreaseMonth,
          increaseMonth,
        }) => (
          <div>
            <button
              type="button"
              aria-label="Previous Month"
              className={
                "react-datepicker__navigation react-datepicker__navigation--previous"
              }
              style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
              onClick={decreaseMonth}
            >
              <span
                className={
                  "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                }
              >
                {"<"}
              </span>
            </button>
            <span className="react-datepicker__current-month">
              {monthDate.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              aria-label="Next Month"
              className={
                "react-datepicker__navigation react-datepicker__navigation--next"
              }
              style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
              onClick={increaseMonth}
            >
              <span
                className={
                  "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                }
              >
                {">"}
              </span>
            </button>
          </div>
        )}
        selected={start}
        monthsShown={2}
        popperPlacement={placement}
        minDate={minDate}
        startDate={startDate}
        endDate={endDate}
        maxDate={maxDate}
        selectsRange={tripType === "Roundtrip"} // Solo seleccionar rango en round trip
        showPopperArrow={false}
      >
        <button className={styles.dataPickerButton} onClick={handleClick}>
          Done
        </button>
      </DatePicker>
  );
}

const CustomInput = React.forwardRef(({ value, onClick, formatDate, tripType }, ref) => {
  // Manejo del rango de fechas o fecha simple
  let formattedValue = "";
  
  if (value) {
    if (tripType === "One-way") {
      // Para one-way, solo mostrar una fecha
      formattedValue = formatDate(new Date(value));
    } else {
      // Para round trip, mostrar rango
      formattedValue = value
        .split(" - ") // Divide el rango en inicio y fin
        .map((date) => (date ? formatDate(new Date(date)) : ""))
        .join(" - "); // Junta el rango con el formato nuevo
    }
  }

  const placeholder = tripType === "One-way" ? "Select departure date" : "Select date range";

  return (
    <div className="custom-input-wrapper">
      <input
        value={formattedValue}
        readOnly // Evita edición manual
        placeholder={placeholder}
        ref={ref}
        type="text"
        onClick={onClick}
      />
      <FaCalendarAlt className="custom-calendar-icon" onClick={onClick} />
    </div>
  );
});
