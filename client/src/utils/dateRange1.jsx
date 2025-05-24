import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function TwoMonthsPicker() {
  const originalDate = new Date(); // or get it as prop

  const [startDate, setStartDate] = React.useState(originalDate);
  const calRef = React.useRef();

  return (
    <DatePicker
      ref={calRef}
      selected={startDate}
      shouldCloseOnSelect={false}
      onChange={(date) => setStartDate(date)}
      showYearPicker
      dateFormat="yyyy"
      yearItemNumber={20}
    >
      <div>
        <button
          onClick={() => {
            setStartDate(originalDate);
            calRef.current.setOpen(false);
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            calRef.current.setOpen(false);
          }}
        >
          Apply
        </button>
      </div>
    </DatePicker>
  );
}