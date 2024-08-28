//const router = require("express").Router();
import { Router } from "express";
import Amadeus from "amadeus";
//const { CLIENT_ID, CLIENT_SECRET } = require('./config');
import { CLIENT_ID, CLIENT_SECRET } from "./config.js";

const router = Router();

const API = `api`;

// This is AMADEUS client for getting authToken that we need to make actual call to amadeus API
const amadeus = new Amadeus({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});

router.get(`/${API}/airports`, async (req, res) => {
  const { page, subType, keyword } = req.query;

  try {
    const response = await amadeus.client.get("/v1/reference-data/locations", {
      keyword,
      subType,
      "page[offset]": page * 10,
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

export default router;
