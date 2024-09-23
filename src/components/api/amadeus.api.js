import axios from "axios";

const CancelToken = axios.CancelToken;

// This function allows you to make GET requests to the backend with the params we need
export const getAmadeusData = (params) => {
  // Destructuring params
  const { keyword = "", page = 0, city = false, airport = true, countryCode="", view="LIGHT" } = params;

  // Checking for proper subType 
  const subTypeCheck = city && airport ? "CITY,AIRPORT" : city ? "CITY" : airport ? "AIRPORT" : "";

  // Amadeus API requires at least 1 character, so with this we can be sure that we can make this request
  const searchQuery = keyword ? keyword : "a";

  // This is an extra tool for canceling requests, to avoid overloading the API 
  const source = CancelToken.source();

  // GET request with all params we need
  const out = axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/airports/?keyword=${searchQuery}&page=${page}&subType=${subTypeCheck}&countryCode=${countryCode}&view=${view}`,
    {
      cancelToken: source.token
    }
  );

  return { out, source };
};