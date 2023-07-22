// SearchStatusContext.js

import React, { createContext, useState } from "react";

export const SearchStatusContext = createContext();

export const SearchStatusProvider = ({ children }) => {
  const [isSearch, setIsSearch] = useState(false);

  return (
    <SearchStatusContext.Provider value={{ isSearch, setIsSearch }}>
      {children}
    </SearchStatusContext.Provider>
  );
};
