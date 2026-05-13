import express from "express";
import http from "http";
import cors from "cors";
import axios from "axios";
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "./config.js";

const app = express();
app.use(cors());

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// Ruta de verificación rápida
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const DEFAULT_LIMIT = 20;
const DEFAULT_LOCALE = "en-us";
const DEFAULT_CABIN_CLASS = "ECONOMY";
const DEFAULT_SORT_BY = "QUALITY";
const DEALS_RANGE_DAYS = 45;

const kiwiClient = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

const secondsToDuration = (seconds = 0) => {
  const totalSeconds = Number(seconds) || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (!hours && !minutes) {
    return "PT0M";
  }

  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}`;
};

const formatMoney = (amount) => Number(amount || 0).toFixed(2);

const formatDate = (date) => date.toISOString().slice(0, 10);

const buildDateRange = (startOffsetDays, endOffsetDays) => {
  const start = new Date();
  const end = new Date();

  start.setDate(start.getDate() + startOffsetDays);
  end.setDate(end.getDate() + endOffsetDays);

  return `${formatDate(start)}..${formatDate(end)}`;
};

const getStationCode = (station = {}) => station.code || station.legacyId || "";

const buildAmenities = ({ includedCabinBags = 1, includedCheckedBags = 0 } = {}) => {

  const amenities = [
    {
      description: "PRE RESERVED SEAT ASSIGNMENT",
      isChargeable: true,
      amenityType: "PRE_RESERVED_SEAT",
      amenityProvider: {
        name: "Kiwi",
      },
    },
  ];

  if (includedCabinBags > 0) {
    amenities.push({
      description: "CARRY16KG 35LB UPTO46LI 118LCM",
      isChargeable: false,
      amenityType: "BAGGAGE",
      amenityProvider: {
        name: "Kiwi",
      },
    });
  }

  amenities.push({
    description: "FIRST CHECKED BAG",
    isChargeable: includedCheckedBags < 1,
    amenityType: "BAGGAGE",
    amenityProvider: {
      name: "Kiwi",
    },
  });

  amenities.push({
    description: "SECOND CHECKED BAG",
    isChargeable: includedCheckedBags < 2,
    amenityType: "BAGGAGE",
    amenityProvider: {
      name: "Kiwi",
    },
  });

  return {
    amenities,
    includedCabinBags: includedCabinBags ? { quantity: includedCabinBags } : undefined,
    includedCheckedBags: { quantity: includedCheckedBags },
  };
};

const mapJourneyToItinerary = (journey) => {
  const segments = (journey?.segments || []).map((segment) => {
    const carrierCode = segment?.carrier?.code || segment?.operating_carrier?.code || "";
    const carrierName = segment?.carrier?.name || segment?.operating_carrier?.name || carrierCode;

    return {
      departure: {
        iataCode: getStationCode(segment?.source?.station),
        at: segment?.source?.local_time,
      },
      arrival: {
        iataCode: getStationCode(segment?.destination?.station),
        at: segment?.destination?.local_time,
      },
      carrierCode,
      carrierName,
      number: segment?.flight_number || "",
      operating: {
        carrierCode: segment?.operating_carrier?.code || carrierCode,
        carrierName: segment?.operating_carrier?.name || carrierName,
      },
      duration: secondsToDuration(segment?.duration_seconds),
      id: segment?.id || `${carrierCode}-${segment?.code || ""}`,
      numberOfStops: 0,
      blacklistedInEU: false,
    };
  });

  const fareInfo = buildAmenities();

  return {
    duration: secondsToDuration(journey?.duration_seconds),
    segments,
    fareDetailsBySegment: segments.map((segment) => ({
      segmentId: segment.id,
      cabin: journey?.segments?.find((item) => item.id === segment.id)?.cabin_class || DEFAULT_CABIN_CLASS,
      class: "Y",
      ...fareInfo,
    })),
  };
};

const mapKiwiOfferToFlightOffer = (offer, currencyCode = "USD") => {
  const normalizedCurrency = (offer?.price?.currency || currencyCode || "USD").toUpperCase();
  const priceTotal = formatMoney(offer?.price?.amount);
  const outboundSector = offer?.outbound;
  const inboundSector = offer?.inbound;
  const firstCarrier =
    outboundSector?.carriers?.[0]?.code ||
    outboundSector?.segments?.[0]?.carrier?.code ||
    outboundSector?.segments?.[0]?.operating_carrier?.code ||
    offer?.provider?.code ||
    "KIWI";
  const firstCarrierName =
    outboundSector?.carriers?.[0]?.name ||
    outboundSector?.segments?.[0]?.carrier?.name ||
    outboundSector?.segments?.[0]?.operating_carrier?.name ||
    firstCarrier;

  const outboundItinerary = mapJourneyToItinerary(outboundSector);
  const itineraries = inboundSector
    ? [outboundItinerary, mapJourneyToItinerary(inboundSector)]
    : [outboundItinerary];

  const travelerPricingSegments = itineraries.flatMap(
    (itinerary) => itinerary.fareDetailsBySegment
  );

  return {
    type: "flight-offer",
    id: offer?.id || offer?.legacyId,
    source: "KIWI",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: !inboundSector,
    isUpsellOffer: false,
    lastTicketingDate: itineraries[0]?.segments?.[0]?.departure?.at?.slice(0, 10),
    lastTicketingDateTime: itineraries[0]?.segments?.[0]?.departure?.at,
    numberOfBookableSeats: 9,
    itineraries: itineraries.map(({ fareDetailsBySegment, ...itinerary }) => itinerary),
    price: {
      currency: normalizedCurrency,
      total: priceTotal,
      base: priceTotal,
      fees: [
        {
          amount: "0.00",
          type: "SUPPLIER",
        },
      ],
      grandTotal: priceTotal,
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: [firstCarrier],
    validatingAirlineNames: [firstCarrierName],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: normalizedCurrency,
          total: priceTotal,
          base: priceTotal,
        },
        fareDetailsBySegment: travelerPricingSegments,
      },
    ],
  };
};

const filterOffers = (offers, { includedAirlineCodes, nonStop }) => {
  const allowedAirlines = new Set(
    String(includedAirlineCodes || "")
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean)
  );
  const nonStopOnly = String(nonStop) === "true";

  return offers.filter((offer) => {
    if (allowedAirlines.size > 0) {
      const validatingCarrier = offer.validatingAirlineCodes?.[0];
      if (!allowedAirlines.has(validatingCarrier)) {
        return false;
      }
    }

    if (nonStopOnly) {
      return offer.itineraries.every((itinerary) => itinerary.segments.length === 1);
    }

    return true;
  });
};

const buildKiwiParams = ({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate,
  adults,
  currencyCode,
  limit = DEFAULT_LIMIT,
  nonStop,
  includedAirlineCodes,
  departureDateRange,
}) => ({
  source: originLocationCode,
  destination: destinationLocationCode,
  currency: String(currencyCode || "USD").toUpperCase(),
  locale: DEFAULT_LOCALE,
  adults: Number(adults) || 1,
  children: 0,
  infants: 0,
  cabin_class: DEFAULT_CABIN_CLASS,
  sort_by: DEFAULT_SORT_BY,
  departure_date: departureDateRange || departureDate,
  return_date: returnDate,
  transport_types: "FLIGHT",
  max_stops: String(nonStop) === "true" ? 0 : 2,
  carriers: includedAirlineCodes || undefined,
  limit,
});

const fetchKiwiItineraries = async (path, params) => {
  if (!RAPIDAPI_KEY) {
    throw new Error("Missing RAPIDAPI_KEY in server .env.local");
  }

  const response = await kiwiClient.get(path, {
    params,
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
  });

  return Array.isArray(response.data?.itineraries) ? response.data.itineraries : [];
};

app.get("/api/deals-dates", async (req, res) => {
  const { originLocationCode, destinationLocationCode, adults, currencyCode } = req.query;

  if (!originLocationCode || !destinationLocationCode) {
    return res.status(400).json({ error: "Missing origin or destination" });
  }

  try {
    const itineraries = await fetchKiwiItineraries(
      "/api/v1/flights/search-oneway",
      buildKiwiParams({
        originLocationCode,
        destinationLocationCode,
        adults,
        currencyCode,
        limit: 10,
        departureDateRange: buildDateRange(1, DEALS_RANGE_DAYS),
      })
    );

    const dates = [];
    const seen = new Set();

    for (const offer of itineraries) {
      const mapped = mapKiwiOfferToFlightOffer(offer, currencyCode);
      const departureDate = mapped.itineraries[0]?.segments[0]?.departure?.at?.slice(0, 10);

      if (!departureDate || seen.has(departureDate)) {
        continue;
      }

      seen.add(departureDate);
      dates.push({
        departureDate,
        price: {
          total: mapped.price.total,
          grandTotal: mapped.price.grandTotal,
        },
      });
    }

    res.json(dates);
  } catch (err) {
    console.error("deals-dates error", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch deals-dates" });
  }
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
    nonStop,
  } = req.query;

  try {
    if (!originLocationCode || !destinationLocationCode) {
      return res.status(400).json({ error: "Missing origin or destination" });
    }

    const endpoint = returnDate ? "/round-trip" : "/one-way";
    const kiwiParams = buildKiwiParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      currencyCode,
      nonStop,
      includedAirlineCodes,
    });

    if (returnDate) {
      delete kiwiParams.locale;
      delete kiwiParams.children;
      delete kiwiParams.infants;
      delete kiwiParams.transport_types;
      delete kiwiParams.max_stops;
      delete kiwiParams.carriers;
    }

    console.log(`${returnDate ? "Round-trip" : "One-way"} Kiwi search:`, {
      endpoint,
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults: adults || 1,
      currencyCode: currencyCode || "USD",
    });

    const itineraries = await fetchKiwiItineraries(
      returnDate ? "/api/v1/flights/search-roundtrip" : "/api/v1/flights/search-oneway",
      kiwiParams
    );
    const offers = itineraries.map((offer) => mapKiwiOfferToFlightOffer(offer, currencyCode));
    const filteredOffers = filterOffers(offers, { includedAirlineCodes, nonStop });

    res.json(filteredOffers);
  } catch (err) {
    console.error("flight search error", err.response?.data || err.message);
    res.status(500).json({ error: "Error al obtener los datos de vuelo" });
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
