import express from "express";
import router from "./router.js"
import cors from "cors";
import Amadeus from "amadeus";
import { CLIENT_ID, CLIENT_SECRET } from "./config.js";
//import data from './file.json' assert { type: 'json' };

const app = express();
app.use(cors());

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// applying handler for API
app.use("/",router)

// This is AMADEUS client for getting authToken that we need to make actual call to amadeus API
const amadeus = new Amadeus({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  hostname: "production",
});

// Ruta para la raíz "/"
app.get('/', async (req, res) => {
  try {
    const response = await amadeus.client.get("/v2/shopping/flight-offers", {
      originLocationCode: 'MIA',
      destinationLocationCode: 'HAV',
      departureDate: '2024-10-01',
      returnDate: '2024-10-10',
      adults: 1,
      currencyCode: 'USD',
      nonStop: true
    });

    res.json(response.data); // Envía la respuesta JSON al cliente
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los datos de vuelo');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Express is running on port http://localhost:${PORT}`);
});
