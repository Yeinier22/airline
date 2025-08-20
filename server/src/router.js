//const router = require("express").Router();
import { Router } from "express";
import Amadeus from "amadeus";
import axios from "axios";
//const { CLIENT_ID, CLIENT_SECRET } = require('./config');
import { CLIENT_ID, CLIENT_SECRET } from "./config.js";

const router = Router();

const API = `api`;

// This is AMADEUS client for getting authToken that we need to make actual call to amadeus API
const amadeus = new Amadeus({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  hostname: "test",
});

/*router.get(`/${API}/airports`, async (req, res) => {
  const { page, subType, keyword, countryCode, view } = req.query;

  try {
    const response = await amadeus.client.get("/v1/reference-data/locations", {
      keyword,
      subType,
      "page[offset]": page * 10,
      "page[limit]": 3000,
      countryCode,
      view,
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

router.get(`/${API}/flight-search`, async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    currencyCode,
  } = req.query;

  try {
    const response = await amadeus.client.get("/v2/shopping/flight-offers", {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults: adults || 1, // Default to 1 adult if not specified
      currencyCode: currencyCode || "USD",
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});*/

const testAirportSearch  = async () => {
  try {
    const response = await amadeus.client.get("/v1/reference-data/locations", {
      keyword: "HOG",
      subType: "CITY,AIRPORT",
      "page[offset]": 0,
      "page[limit]": 3000,
      countryCode : "CU",
      view: "LIGHT",
    });
    console.log(response.data);
  } catch (err) {
    console.error(err);
  }
};

const testFlightSearch= async () => {
  try {
    const response = await amadeus.client.get("/v2/shopping/flight-offers", {
      originLocationCode: "MIA",
      destinationLocationCode: "BOS",
      departureDate: "2025-08-25",
      returnDate: "2025-08-28",
      adults: 1,
      currencyCode: "USD",
      //nonStop: true,
      includedAirlineCodes: "UA,NK",
    });
    console.log(response.data);
  } catch (err) {
    console.error(err);
  }
};

const testDealsDateSearch = async () => {
  try {
    const response = await amadeus.shopping.flightDates.getCheapest({
      origin: "MIA",
      destination: "NYC",
    });
    console.log("=== DEALS DATES TEST ===");
    console.log(JSON.parse(response.body));
  } catch (err) {
    console.error("Error en deals dates:", err);
  }
};

//testAirportSearch();
//testFlightSearch();
//testDealsDateSearch();

export default router;

    router.get(`/${API}/deals-dates`, async (req, res) => {
      const { originLocationCode, destinationLocationCode } = req.query;

      try {
        const response = await amadeus.shopping.flightDates.getCheapest({
          origin: originLocationCode,
          destination: destinationLocationCode,
        });

        res.json(JSON.parse(response.body));
      } catch (err) {
        res.json(err);
      }
    });

//D:\Programming\Projects\airline-web\Backend\src>     node router.js