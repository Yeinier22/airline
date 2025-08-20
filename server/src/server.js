import express from "express";
import http from "http";
import router from "./router.js";
import cors from "cors";
import Amadeus from "amadeus";
import { CLIENT_ID, CLIENT_SECRET } from "./config.js"
//import data from './file.json' assert { type: 'json' };

const app = express();
app.use(cors());

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// Ruta de verificación rápida
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// applying handler for API
app.use("/", router);

// Endpoint: Flight Cheapest Date Search (Amadeus)
app.get("/api/deals-dates", async (req, res) => {
  const { originLocationCode, destinationLocationCode } = req.query;
  if (!originLocationCode || !destinationLocationCode) {
    return res.status(400).json({ error: "Missing origin or destination" });
  }
  try {
    const response = await amadeus.client.get("/v1/shopping/flight-dates", {
      origin: originLocationCode,
      destination: destinationLocationCode,
      departureDate: "2025-08-15",
    });
    res.json(response.data);
  } catch (err) {
    console.error("deals-dates error", err);
    res.status(500).json({ error: "Failed to fetch deals-dates" });
  }
});

// This is AMADEUS client for getting authToken that we need to make actual call to amadeus API
const amadeus = new Amadeus({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  hostname: "test",    //production, test
});

// Ruta para la raíz "/"
app.get("/", async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    currencyCode,
    includedAirlineCodes,
  } = req.query;
  try {
    const response = await amadeus.client.get("/v2/shopping/flight-offers", {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults: adults || 1,
      currencyCode: currencyCode || "USD",
      includedAirlineCodes: includedAirlineCodes || "UA,NK,F9,B6",
      nonStop: false,
    });

    res.json(response.data); // Envía la respuesta JSON al cliente
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los datos de vuelo");
  }
});

// Iniciar el servidor con manejo de puerto ocupado
function startServer(port) {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Express is running on port http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.log(`Puerto ${port} ocupado, intentando con el siguiente...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
}

startServer(Number(PORT));

const logAirlines = {
  UA: "United Airlines",
  AC: "Air Canada",
  NK: "Spirit Airlines",
  F9: "Frontier Airlines",
  HA: "Hawaiian Airlines",
  B6: "JetBlue Airways",
};

/*originLocationCode: "MIA",
destinationLocationCode: "BOS",
departureDate: "2025-03-25",
returnDate: "2025-03-28",
adults: 1,
currencyCode: "USD",
//nonStop: true,
includedAirlineCodes: "UA,NK",*/

/*originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults: adults || 1,
      currencyCode: currencyCode || "USD",
      includedAirlineCodes:includedAirlineCodes || "UA,NK,F9,B6",
      nonStop: true*/
