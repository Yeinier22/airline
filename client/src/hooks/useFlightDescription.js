const capitalizeFirstLetter = (str) => {
  const stringLowerCase = str.toLowerCase();
  return stringLowerCase.charAt(0).toUpperCase() + stringLowerCase.slice(1);
};

export const useFlightDescription = (isReturn, flightInformation) => {
  if (
    !flightInformation ||
    !flightInformation.departCity?.details?.airport ||
    !flightInformation.returnCity?.details?.airport
  ) {
    return { depart: "", departCode: "", arrival: "", arrivalCode: "" };
  }
  const depart = capitalizeFirstLetter(
    isReturn
      ? flightInformation.returnCity.details.airport.cityName
      : flightInformation.departCity.details.airport.cityName
  );
  const departCode = isReturn
    ? flightInformation.returnCity.details.airport.iataCode
    : flightInformation.departCity.details.airport.iataCode;

  const arrival = capitalizeFirstLetter(
    isReturn
      ? flightInformation.departCity.details.airport.cityName
      : flightInformation.returnCity.details.airport.cityName
  );
  const arrivalCode = isReturn
    ? flightInformation.departCity.details.airport.iataCode
    : flightInformation.returnCity.details.airport.iataCode;

  return { depart, departCode, arrival, arrivalCode };
};
