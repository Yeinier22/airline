////padStart(2, '0'), Si la longitud no es 2, se le pone un 0 delante////
///debemos ponerlo con una condicion porque por ejemplo cuando volvemos
///a cargar la pagina en algun momento departureDate sera null o undefined,
///y dara error getFullYear, hasta que el useEffect de arriba se complete

export const formatDate = (date) => {
  if (!(date instanceof Date)) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const formatDateString = (string) => {
  const date = new Date(string);
  if (isNaN(date.getTime())) return ""; // Fecha inválida
  const options = { weekday: "short", month: "short", day: "numeric" };
  const parts = date.toLocaleDateString("en-US", options);
  return parts; // "Fri, Mar 28"
};
