import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
//import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";
import { selectAirport } from "./airportsMap";
import styles from "../Book.module.css";

const SearchAutocomplete = (props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);

  const names = () => {
    if (options.length > 0) {
      return options.map((location) => ({
        label: `${location.airport.iataCode} - ${location.airport.name}, ${
          location.airport.state ? location.airport.state : location.country
        }`,
      }));
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      setLoading(true);
      setTimeout(() => {
        setOptions(selectAirport(debouncedSearch, props.index) || []);
        setLoading(false);
      }, 100);
    } else {
      setOptions([]); // Limpia las opciones cuando la búsqueda es muy corta
    }
  }, [debouncedSearch, props.index]);

  //const label1 = "City and Airports";

  return (
    <Autocomplete
    sx={{
        "& input": {
          height: "15px",  // Solo funcionará si el contenedor padre tiene una altura definida
        }
      }}
      id="asynchronous-demo"
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      onChange={(e, value) => {
        if (value && value.label) {
          //props.setSearch((p) => ({ ...p, keyword: value.name, page: 0 }));
          setSearch(value.label);
        } else {
          setSearch("");
        }
        //props.setSearch((p) => ({ ...p, keyword: "a", page: 0 }));
      }}
      getOptionLabel={(option) => option.label || "Información no disponible"}
      options={names()}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          //label={label1}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            value: search,
          }}
          InputProps={{
            ...params.InputProps,
            className: `${styles.searchInput} ${styles.withIcon}`,
            endAdornment: (
              <>
                {/*loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment*/}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;
