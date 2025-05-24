export function filterData({
  data,
  nonStops = false,
  withStops = false,
  selectedAirlines = [],
  isReturn,
}) {
  const itineraryIndex = isReturn ? 1 : 0;
  /*const selectedAirlineCodes = selectedAirlines //Esto la cambiamos en choose, servia cuando el formato era F9: isChecked,
    .filter((airline) => airline.isChecked)       //ahora en el array solo tenemos las aerolineas checked
    .map((airline) => airline.code);*/

  return data.filter((flight) => {
    const numNonStop = flight.itineraries[itineraryIndex].segments.length === 1;
    const numWithStops = flight.itineraries[itineraryIndex].segments.length > 1;

    // Filtro por stops
    const passesStopFilter =
      (!nonStops && !withStops) || // Mostrar todos los vuelos
      (nonStops && numNonStop) || // Mostrar solo sin escalas
      (withStops && numWithStops); // Mostrar solo con escalas

    // Filtro por aerolíneas
    const passesAirlineFilter =
      selectedAirlines.length === 0 || // Mostrar todas si no hay seleccionadas
      selectedAirlines.includes(flight.validatingAirlineCodes[0]);

    // Combinar ambos filtros
    return passesStopFilter && passesAirlineFilter;
  });
}

/*export function filterFlights({
  data,
  selectedAirlines = [],
  isCheckedNonStop = false,
  isCheckedWithStop = false,
}) {
  const selectedAirlineCodes = selectedAirlines
    .filter((airline) => airline.isChecked)
    .map((airline) => airline.code);

  return data.filter((flight) => {
    const nonStop = flight.itineraries[0].segments.length === 1;
    const withStops = flight.itineraries[0].segments.length > 1;

    const filtroAerolinea =
      selectedAirlineCodes.length === 0 ||
      selectedAirlineCodes.includes(
        flight.itineraries[0].segments[0].carrierCode
      );

    const filtroTipoVuelo =
      (!isCheckedNonStop && !isCheckedWithStop) ||
      (isCheckedNonStop && nonStop) ||
      (isCheckedWithStop && withStops);

    return filtroAerolinea && filtroTipoVuelo;
  });
}*/

/*export function resultFilter(
  data,
  selectedAirlines,
  isCheckedNonStop,
  isCheckedWithStop
) {
  //Create an array of the checked airlines
  const selectedAirlineCodes = selectedAirlines
    .filter((airline) => airline.isChecked)
    .map((airline) => airline.code);

  const resultadosFiltrados = data.filter((flight) => {
    const nonStop = flight.itineraries[0].segments.length === 1;
    const withStops = flight.itineraries[0].segments.length > 1;

    // Verificar si debemos mostrar todos los data (ambos filtros desmarcados)
    const mostrarTodosLosVuelos = !isCheckedNonStop && !isCheckedWithStop;

    // Filtrar por aerolínea
    const filtroAerolinea =
      selectedAirlineCodes.length === 0 ||
      selectedAirlineCodes.includes(
        flight.itineraries[0].segments[0].carrierCode
      );

    // Filtrar por tipo de flight
    const filtroTipoVuelo =
      mostrarTodosLosVuelos ||
      (isCheckedNonStop && nonStop) ||
      (isCheckedWithStop && withStops);

    // Aplicar ambos filtros
    return filtroAerolinea && filtroTipoVuelo;
  });

  return resultadosFiltrados;
}

export function nonStopFilter(data, selectedAirlines) {
  const selectedAirlineCodes = selectedAirlines
    .filter((airline) => airline.isChecked)
    .map((airline) => airline.code);

  const resultadosFiltrados = data.filter((flight) => {
    const nonStopFilter = flight.itineraries[0].segments.length === 1;

    // Filtrar por aerolínea
    const filtroAerolinea =
      selectedAirlineCodes.length === 0 ||
      selectedAirlineCodes.includes(
        flight.itineraries[0].segments[0].carrierCode
      );

    return filtroAerolinea && nonStopFilter;
  });
  return resultadosFiltrados;
}

export function withStopFilter(data, selectedAirlines) {
    const selectedAirlineCodes = selectedAirlines
      .filter((airline) => airline.isChecked)
      .map((airline) => airline.code);
  
    const resultadosFiltrados = data.filter((flight) => {
      const withStopFilter = flight.itineraries[0].segments.length > 1;
  
      // Filtrar por aerolínea
      const filtroAerolinea =
        selectedAirlineCodes.length === 0 ||
        selectedAirlineCodes.includes(
          flight.itineraries[0].segments[0].carrierCode
        );
  
      return filtroAerolinea && withStopFilter;
    });
    return resultadosFiltrados
  }

  
  export function airlineFilter(
    data,
    isCheckedNonStop,
    isCheckedWithStop
  ) {
    //Create an array of the checked airlines

    const resultadosFiltrados = data.filter((flight) => {
      const nonStop = flight.itineraries[0].segments.length === 1;
      const withStops = flight.itineraries[0].segments.length > 1;
  
      // Verificar si debemos mostrar todos los data (ambos filtros desmarcados)
      const mostrarTodosLosVuelos = !isCheckedNonStop && !isCheckedWithStop;
  
      // Filtrar por tipo de flight
      const filtroTipoVuelo =
        mostrarTodosLosVuelos ||
        (isCheckedNonStop && nonStop) ||
        (isCheckedWithStop && withStops);
  
      // Aplicar ambos filtros
      return filtroTipoVuelo;
    });
  
    return resultadosFiltrados;
  }*/
