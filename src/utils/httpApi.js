/*import json from react-router-dom

/*export function get({ callsign }) {
  return fetch(`https://api.adsbdb.com/v0/callsign/${callsign}`).then(
    (response) => {
      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json(); // Convierte la respuesta a JSON
    }
  );
}*/

export const fetchFlightData = async ({flightInformation}) => {
  try {
    const res = await fetch("http://localhost:3000/api/flight-search", {
      method: "GET",
      params: {
        originLocationCode: flightInformation.departCity.label,
        destinationLocationCode: flightInformation.returnCity.label,
        departureDate: "2024-10-15",
        returnDate: "",
        adults: 1,
        currencyCode: "USD",
      },
    });
    console.log(res.data); // Aquí manejarías los datos de la respuesta
    /*if (!res.ok) throw new Error("Error fetching the list");
    const json = await res.json();
    return [undefined, json];
  } catch (error) {
    return [error, undefined];
  }*/
  } catch (error) {
    console.error("Error fetching flight data", error);
};
}