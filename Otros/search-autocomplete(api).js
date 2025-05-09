import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { getAmadeusData } from "../api/amadeus.api";
import useDebounce from "../../hooks/useDebounce";

const SearchAutocomplete = (props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);

  const findIata = options.find((option) => option.iataCode === debouncedSearch.toUpperCase());

  const names = () => {
    if (findIata) {
      // Si se encuentra un match exacto con "MIA", devuelve solo ese
      return [
        {
          label: `${findIata.iataCode} - ${findIata.name}, ${
            findIata.address.stateCode
              ? findIata.address.stateCode
              : findIata.address.countryName
          }`,
          iataCode: findIata.iataCode,
          name: findIata.name,
          stateCode: findIata.address?.stateCode,
        }
      ];
    } else {
      // Si no se encuentra un match exacto, devuelve la lista completa
      return options.map((location) => ({
        label:
          location.iataCode &&
          location.name &&
          (location.address.stateCode || location.address.countryName)
            ? `${location.iataCode} - ${location.name}, ${
                location.address.stateCode
                  ? location.address.stateCode
                  : location.address.countryName
              }`
            : "Información no disponible",
        iataCode: location.iataCode,
        name: location.name,
        stateCode: location.address?.stateCode,
      }));
    }
  };

  useEffect(() => {
    if (debouncedSearch.length >= 0) {
      setLoading(true);

      const { out, source } = getAmadeusData({
        ...props.search,
        page: 0,
        keyword: debouncedSearch,
        countryCode: "CU",
        view: "FULL",
        "page[limit]": 1000 
      });

      out
        .then((res) => {
          if (!res.data.code) {
            //Code es un error que puede dar la API
            setOptions(res.data.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setOptions([]);
          }
          setLoading(false);
        });

      return () => {
        source.cancel();
      };
    } else {
      setOptions([]);
    }
  }, [debouncedSearch]);

  const { city, airport } = props.search;

  const label =
    city && airport
      ? "City and Airports"
      : city
      ? "City"
      : airport
      ? "Airports"
      : "";

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300, marginBottom: "1rem" }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionSelected={(option, value) =>
        option.iataCode === value.iataCode && option.name === value.name
      }
      onChange={(e, value) => {
        if (value && value.name) {
          props.setSearch((p) => ({ ...p, keyword: value.name, page: 0 }));
          setSearch(value.name);
          return;
        }
        setSearch("");
        props.setSearch((p) => ({ ...p, keyword: "a", page: 0 }));
      }}
      getOptionLabel={(option) => option.label || "Información no disponible"}
      options={names()}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            value: search,
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;
