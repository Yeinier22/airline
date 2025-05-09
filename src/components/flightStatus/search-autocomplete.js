import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
//import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";
import { selectAirport } from "./airportsMap";
import styles from "../Book1.module.css";
import { MdLocationOn } from "react-icons/md";
//import styles from "../Book1.module.css"

const Search = ({ index, onSearchChange, initialValue, className, place }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState(initialValue || "");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastValidValue,setLastValidValue]=useState();

  //Search is the text that the user writes in the input
  //debouncedSearch is the same text, but with a 200 ms delay to prevent the effect from being triggered on every keystroke
  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    // Write: "MIA" → debouncedSearch = "MIA"
    // Erase everything manually → search = "" → luego de 200 ms → debouncedSearch = ""
    if (debouncedSearch === "") {
      onSearchChange(null);
      setLastValidValue(""); // también limpia el último valor válido si quieres
    }
  }, [debouncedSearch]);

  const names = () => {
    if (options.length > 0) {
      return options.map((location) => ({
        label: `${location.airport.iataCode} - ${
          location.airport.state ? location.airport.state : ""
        } ${location.airport.name}, ${
          location.airport.state ? location.region : location.country
        }`,
        details: location,
      }));
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (debouncedSearch.length >= 3 && isTyping) {
      setLoading(true);
      setTimeout(() => {
        setOptions(selectAirport(debouncedSearch, index) || []);
        setLoading(false);
      }, 100);
    } else {
      setOptions([]); // Limpia las opciones cuando la búsqueda es muy corta
    }
  }, [debouncedSearch, index, isTyping]);

  //const label1 = "City and Airports";

  /*useEffect(() => {
    // Si el valor inicial cambia (cuando se cargue el componente), establece el valor del input sin activar la búsqueda
    if (initialValue) {
      setSearch(initialValue);
      setIsTyping(false); // Asegura que la búsqueda no se realice hasta que el usuario comience a escribir
    }
  }, [initialValue]);*/

  return (
    <Autocomplete
      className={className}
      sx={{
        "& input": {
          height: "15px", // Solo funcionará si el contenedor padre tiene una altura definida
        },
      }}
      id="asynchronous-demo"
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      onChange={(e, value) => {
        if (value && value.label) {
          setLastValidValue(value.details.airport.iataCode); // Guarda el código IATA del valor válido
          setSearch(value.details.airport.iataCode); // Muestra solo el código IATA en el input
          onSearchChange(value.details); // Notifica la selección al padre
        } else {
          setSearch(""); // Limpia el input si no hay selección
          setLastValidValue(""); // Limpia el último valor válido
          onSearchChange(null);
        }
      }}
      onInputChange={(_, newInputValue, reason) => {
      
        if (reason === "input") {
          setSearch(newInputValue); // Actualiza el texto visible en el input mientras se escribe
      
          // Limpia el valor global si no hay coincidencias
          if (!names().some((opt) => opt.label.startsWith(newInputValue))) {
            //onSearchChange(null);
          }
        }
      
        if (reason === "blur") {
          // Cuando se pierde el foco, restaura el último valor válido si no hay coincidencia
          if (!names().some((opt) => opt.label.startsWith(newInputValue))) {
            setSearch(lastValidValue); // Restaura el último valor válido
          }
        }
      }}

      getOptionLabel={(option) => option.label || "Información no disponible"}
      options={names()}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={place}
          fullWidth
          onChange={(e) => {
            setSearch(e.target.value);
            setIsTyping(true); // Solo habilita la búsqueda cuando el usuario escribe
          }}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            value: search,
            required: true,
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

function SearchAutocomplete({ index, onSearchChange, initialValue, place }) {
  return (
    <div className={styles.formCity}>
      <Search
        index={index}
        onSearchChange={onSearchChange}
        initialValue={initialValue}
        place={place}
      />
      <MdLocationOn  size={25} className={styles.searchIcon} />
    </div>
  );
}

export default SearchAutocomplete;
