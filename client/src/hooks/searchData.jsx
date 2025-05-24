import { createContext, useState } from "react";

// Crea el contexto
export const SearchDataContext = createContext();

// Crea el proveedor para envolver la aplicación
export function SearchDataProvider({ children }) {

  const [searchData, setSearchData] = useState(false);

  return (
    <SearchDataContext.Provider value={{ searchData, setSearchData }}>
      {children}
    </SearchDataContext.Provider>
  );
}
