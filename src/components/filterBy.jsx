import styles from "./filterBy.module.css";
import { filterData } from "../utils/resultFilter";
import { useMemo } from "react";


export function FilterBy({
  itiner,
  itiner2,
  checkHandleStop,
  isChecked,
  checkedAirlines,
  setCheckedAirlines,
  airlineData,
  findCheckedAirlines,
  isReturn,
  isMobile
}) {
 
  const filterNonStops = useMemo(
    () =>
      filterData({
        data: itiner2,
        selectedAirlines: checkedAirlines,
        nonStops: true,
        withStops: false,
        isReturn,
      }),
    [itiner2, checkedAirlines, isReturn]
  );
  

  const filterWithStops = useMemo(
    () =>
      filterData({
        data: itiner2,
        selectedAirlines: checkedAirlines,
        nonStops: false,
        withStops: true,
        isReturn
      }),
    [itiner2, checkedAirlines, isReturn]
  );

  const stopOptions = [
    { type: "nonStops", data: filterNonStops },
    { type: "withStops", data: filterWithStops },
  ];


  const airlineCounts = useMemo(() => {
    const counts = {};
    itiner.forEach((itine) => {
      const code = itine.validatingAirlineCodes[0];
      counts[code] = (counts[code] || 0) + 1;
    });
    return counts;
    
  }, [itiner]);


  //////Min price for option///////
  function minPrice(data) {
    if (!data.length) return 0;
    return data.reduce((min, offer) => {
      const offerPrice = parseFloat(offer.price.grandTotal); // Convertir a número si es string
      return offerPrice < min ? offerPrice : min;
    }, Infinity);
  }
  ////////////////////////

  ////Filter by airline code////////
  const filterByAirline = (data, code) =>
    data.filter((offer) => offer.validatingAirlineCodes[0] === code);
  ////////////////////

  return (
    <div>
      
      <div>
        <h2>Filter By</h2>
        <div className={`${styles.filterContainer} ${isMobile ? styles.mobileFilter : styles.desktopFilter}`}>
          <div className={styles.filterStopsContainer}>
            <div className={styles.filterStopsHeader}>
              <p>
                <strong>Stops</strong>
              </p>
              <p>
                <strong>From</strong>
              </p>
            </div>
            <div className={styles.filterSection}>
              <ul>
                {stopOptions.map(({ type, data }) =>
                  data.length > 0 ? (
                    <li key={type} className={styles.listAirlines}>
                      <div className={styles.filterItems}>
                        <div className={styles.filterOption}>
                          <input
                            type="checkbox"
                            id={type}
                            checked={isChecked(type)}
                            onChange={() => checkHandleStop(type)}
                            className={styles.airlineCheckbox}
                          />
                          <label htmlFor={type}>
                            {type === "nonStops" ? "NonStops" : "WithStops"} (
                            {data.length})
                          </label>
                        </div>
                        <p className={styles.fliterPrice}>${minPrice(data)}</p>
                      </div>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
          <div className={styles.filterAirLinesContainer}>
            <div className={styles.filterStopsHeader}>
              <p>
                <strong>Airlines</strong>
              </p>
              <p>
                <strong>From</strong>
              </p>
            </div>
            <div className={styles.filterSection}>
              <ul>
                {airlineData.map(({ code, name }) =>
                  airlineCounts[code] > 0 ? (
                    <li key={code} className={styles.listAirlines}>
                      <div className={styles.filterItems}>
                        <div className={styles.filterOption}>
                          <input
                            type="checkbox"
                            id={`airline-${code}`}
                            checked={findCheckedAirlines(code) || false}
                            onChange={() => setCheckedAirlines(code)}
                            className={styles.airlineCheckbox}
                          />
                          <label htmlFor={`airline-${code}`}>
                            {name} ({airlineCounts[code]})
                          </label>
                        </div>
                        <p className={styles.fliterPrice}>
                          ${minPrice(filterByAirline(itiner, code))}
                        </p>
                      </div>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
