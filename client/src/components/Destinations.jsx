import { useContext, useMemo, useState } from "react";
import styles from "./destinations.module.css";
import data from "./destinations-data.json";
import { FlightContext } from "../utils/flightContext";
import { BACKEND_URL } from "../config";
import DestinationImage from "./DestinationImage";

export default function Destinations() {
  const { flightInformation } = useContext(FlightContext);
  const userOrigin = flightInformation?.departCity?.label || "MIA";

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    nonStop: false,
    lt200: false,
    weekend: false,
    family: false,
  });
  const [sortBy, setSortBy] = useState("popularity");
  const [loadingIata, setLoadingIata] = useState(null);
  const [datesByIata, setDatesByIata] = useState({});
  const [errorByIata, setErrorByIata] = useState({});

  // Helpers for mock presentation
  const codeToCity = {
    MIA: "Miami",
    FLL: "Fort Lauderdale",
    JFK: "New York",
    LGA: "New York",
    EWR: "Newark",
    ATL: "Atlanta",
    ORD: "Chicago",
    DFW: "Dallas",
    DEN: "Denver",
    SFO: "San Francisco",
    LAS: "Las Vegas",
    BOS: "Boston",
    SEA: "Seattle",
    IAH: "Houston",
    LAX: "Los Angeles",
    MCO: "Orlando",
  };

  function nextWeekendRange(maxWeeks = 8) {
    const now = new Date();
    const weekOffset = Math.floor(Math.random() * maxWeeks); // 0..7
    const base = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + weekOffset * 7
    );
    // Find next Thursday (4) to Sunday (7) window
    const day = base.getDay();
    const toThu = (4 - day + 7) % 7; // 0..6
    const start = new Date(base);
    start.setDate(base.getDate() + toThu);
    const end = new Date(start);
    end.setDate(start.getDate() + 2);
    const fmt = (d) =>
      d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    return { start, end, label: `${fmt(start)} - ${fmt(end)}` };
  }

  const randPct = () => 10 + Math.floor(Math.random() * 61); // 10..70
  const randFoundHours = () => 1 + Math.floor(Math.random() * 9); // 1..9

  const normalized = useMemo(() => {
    let list = data;

    //  FILTER OUT ORIGIN CITY - never show origin as destination
    list = list.filter((d) => d.iata !== userOrigin);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.iata.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q)
      );
    }
    if (filters.nonStop) list = list.filter((d) => d.nonStop === true);
    if (filters.lt200) list = list.filter((d) => Number(d.samplePrice) < 200);
    if (filters.weekend) list = list.filter((d) => d.tags?.includes("weekend"));
    if (filters.family)
      list = list.filter((d) => d.tags?.includes("family-friendly"));

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "price") return a.samplePrice - b.samplePrice;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "alpha") return a.city.localeCompare(b.city);
      return 0;
    });
    return sorted;
  }, [query, filters, sortBy, userOrigin]);

  const onToggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const fetchCheapestDates = async (destIata) => {
    if (!BACKEND_URL) {
      setErrorByIata((e) => ({ ...e, [destIata]: "BACKEND_URL no definido" }));
      return;
    }
    setLoadingIata(destIata);
    setErrorByIata((e) => ({ ...e, [destIata]: undefined }));
    try {
      const url = `${BACKEND_URL}/api/deals-dates?originLocationCode=${encodeURIComponent(
        userOrigin
      )}&destinationLocationCode=${encodeURIComponent(destIata)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // Expect array of items with departureDate and price.total
      const top = Array.isArray(json)
        ? json.slice(0, 6).map((i) => ({
            date: i?.departureDate || i?.departure || "",
            price: i?.price?.total || i?.price?.grandTotal || "",
          }))
        : [];
      setDatesByIata((m) => ({ ...m, [destIata]: top }));
    } catch (err) {
      setErrorByIata((e) => ({
        ...e,
        [destIata]:
          "No data in sandbox for this route or network error. Try another destination.",
      }));
    } finally {
      setLoadingIata(null);
    }
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.headerRow}>
        <h2>Destinations</h2>
        <span className={styles.badge}>Demo data</span>
      </div>

      <p className={styles.disclaimer}>
        This section uses simulated data to display the UI. The CTA queries real
        dates (sandbox) using your origin<strong>{userOrigin}</strong>.
      </p>

      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="Search city, state, or IATA"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.filters}>
          <label>
            <input
              type="checkbox"
              checked={filters.nonStop}
              onChange={() => onToggle("nonStop")}
            />{" "}
            non-stop
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.lt200}
              onChange={() => onToggle("lt200")}
            />{" "}
            {"< $200"}
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.weekend}
              onChange={() => onToggle("weekend")}
            />{" "}
            weekend
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.family}
              onChange={() => onToggle("family")}
            />{" "}
            family-friendly
          </label>
        </div>
        <div className={styles.sorts}>
          <label>
            Sort by:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popularity">popularidad</option>
              <option value="price">price</option>
              <option value="alpha">A-Z</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.grid}>
        {normalized.map((d) => {
          const range = nextWeekendRange();
          const pct = randPct();
          const hours = randFoundHours();
          const originCode = userOrigin;
          const originCity = codeToCity[originCode] || "Your city";
          const stopText = d.nonStop ? "" : "+1";
          return (
            <article key={d.iata} className={styles.card}>
              {/* Top: Date range */}
              <div className={styles.meta}>
                <h3 style={{ margin: 0 }}>{range.label}</h3>
                <div
                  className={styles.rowBetween}
                  style={{ marginTop: 4, color: "#0f172a" }}
                >
                  <strong>
                    {originCity} ({originCode}) → {d.city} ({d.iata})
                  </strong>
                  {stopText && (
                    <span
                      style={{
                        color: "#475569",
                        background: "#f8fafc",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 12,
                      }}
                    >
                      {stopText}
                    </span>
                  )}
                </div>
              </div>

              {/* Green deal banner */}
              <div
                style={{
                  background: "#0f766e",
                  color: "#e7f7f4",
                  borderRadius: 8,
                  margin: "8px 12px 0",
                  padding: "6px 10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    background: "#ecfdf5",
                    color: "#065f46",
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <span>{pct}% less than typical</span>
              </div>

              {/* City image */}
              <div className={styles.thumbWrap} style={{ marginTop: 8 }}>
                <DestinationImage
                  images={d.heroImage}
                  alt={`${d.city}, ${d.state}`}
                  interval={5000}
                  showIndicators={true}
                />
                <div className={styles.iata}>{d.iata}</div>
              </div>

              {/* Tags and popularity/price (demo) */}
              <div className={styles.meta}>
                <div className={styles.tags}>
                  {d.tags?.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.rowBetween}>
                  <span className={styles.price}>
                    From ${d.samplePrice} <em>(demo)</em>
                  </span>
                  <span className={styles.pop}>★ {d.popularity}</span>
                </div>
                <button
                  className={styles.cta}
                  disabled={loadingIata === d.iata}
                  onClick={() => fetchCheapestDates(d.iata)}
                >
                  {loadingIata === d.iata
                    ? "Searching...."
                    : "View cheapest dates"}
                </button>
                <div style={{ color: "#475569", marginTop: 6 }}>
                  Found {hours} hours ago
                </div>

                {errorByIata[d.iata] && (
                  <div className={styles.error}>{errorByIata[d.iata]}</div>
                )}
                {datesByIata[d.iata]?.length > 0 && (
                  <ul className={styles.dates}>
                    {datesByIata[d.iata].map((r, idx) => (
                      <li key={idx}>
                        <span>{r.date}</span>
                        <strong>{r.price ? `$${r.price}` : "—"}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
