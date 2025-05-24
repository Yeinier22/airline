import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function TwoMonthsPicker({
  minDate,
  start,
  startDate,
  endDate,
  maxDate,
  onChangeDate,
}) {
  const [placement, setPlacement] = useState("bottom-start");

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

  return (
    <DatePicker
      customInput={<CustomInput />}
      placeholderText="mm/dd/yyyy"
      onChange={onChangeDate}
      renderCustomHeader={({
        monthDate,
        customHeaderCount,
        decreaseMonth,
        increaseMonth,
      }) => (
        <div>
          <button
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
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
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
    />
  );
}

const CustomInput = React.forwardRef(
  ({ value, onClick, onChange, placeholder }, ref) => (
    <div className="custom-input-wrapper">
      <input
        value={value}
        onChange={onChange} // Permite la edición en el input
        placeholder={placeholder}
        ref={ref}
      />
      <button type="button" className="custom-calendar-icon" onClick={onClick}>
        📅
      </button>
    </div>
  )
);
