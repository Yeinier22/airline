
export function getImages(itiner) {
  const logAirlines = {
    UA: "united",
    AC: "airCanada",
    NK: "spirit",
    F9: "Frontier",
    HA: "hawaiian",
    B6: "JetBlue",
  };

  const carrierCode = itiner.itineraries[0].segments[0].carrierCode;
  const IsCarrierCode = carrierCode in logAirlines;

  return IsCarrierCode
    ? `./images/${logAirlines[carrierCode]}.jpg`
    : "./images/placeholder.jpg";
}
