/*import json from react-router-dom

export function get({ callsign }) {
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

/*export const get = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/flights", {
      method: "GET",
    });
    if (!res.ok) throw new Error("Error fetching the list");
    const json = await res.json();
    return [undefined, json];
  } catch (error) {
    return [error, undefined];
  }
};*/