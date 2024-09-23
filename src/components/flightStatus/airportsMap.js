
export function buildIndex(locations) {
    let index = new Map();
  
    Object.keys(locations).forEach(country => {
      Object.keys(locations[country]).forEach(region => {
        locations[country][region].forEach(airport => {
          let keys = [
            airport.iataCode.toLowerCase(),
            airport.name.toLowerCase(),
            airport.state ? airport.state.toLowerCase() : country.toLowerCase()
          ];
          
          keys.forEach(key => {
            if (!index.has(key)) {
              index.set(key, []);
            }
            index.get(key).push({ country, region, airport });
          });
        });
      });
    });
  
    return index;
  }

  export function selectAirport(keyword, index) {
    keyword = keyword.toLowerCase(); // Normaliza el keyword a minúsculas
    let matches = [];
  
    // Itera sobre todas las claves del Map
    index.forEach((value, key) => {
      if (key.startsWith(keyword)) { // Busca claves que comiencen con el keyword
        matches = matches.concat(value); // Agrega las coincidencias encontradas
      }
    });

   // Filtra duplicados basados en iataCode y name
  const uniqueMatches = Array.from(
    new Set(matches.map((item) => item.airport.iataCode + item.airport.name))
  ).map((uniqueKey) => {
    return matches.find(
      (item) => item.airport.iataCode + item.airport.name === uniqueKey
    );
  });
  return uniqueMatches
  }