export const handleDepartCityChange = (setFlightInformation) => (value) => {
  if (!value) {
    setFlightInformation((prev) => ({
      ...prev,
      departCity: {
        label: '',
        details: null,
      },
    }));
    return;
  }

  setFlightInformation((prev) => ({
    ...prev,
    departCity: {
      label: value.airport.iataCode,
      details: value,
    },
  }));
};

export const handleReturnCityChange = (setFlightInformation) => (value) => {
  if (!value) {
    setFlightInformation((prev) => ({
      ...prev,
      returnCity: {
        label: '',
        details: null,
      },
    }));
    return;
  }

  setFlightInformation((prev) => ({
    ...prev,
    returnCity: {
      label: value.airport.iataCode,
      details: value,
    },
  }));
};
