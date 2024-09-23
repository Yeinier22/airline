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
  hostname: "production",
});

router.get(`/${API}/airports`, async (req, res) => {
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
});

const testFlightSearch = async () => {
  try {
    const response = await amadeus.client.get("/v2/shopping/flight-offers", {
      originLocationCode: "MIA",
      destinationLocationCode: "HAV",
      departureDate: "2024-10-01",
      returnDate: "2024-10-10",
      adults: 1,
      currencyCode: "USD",
    });
    console.log(response.data);
  } catch (err) {
    console.error(err);
  }
};

//testFlightSearch();

export default router;
