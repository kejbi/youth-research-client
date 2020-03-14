import React, { createContext, useReducer, useEffect } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_TAB":
      return {
        tab: action.tab
      };
    default:
      return state;
  }
};

const initialState = {
  tab: ""
};

export const NavContext = createContext(initialState);

const NavContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <NavContext.Provider value={[state, dispatch]}>
      {children}
    </NavContext.Provider>
  );
};

export default NavContextProvider;
