import React, { createContext, useReducer, useEffect } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_GROUP":
      return action.groupId;

    default:
      return state;
  }
};

const initialState = null;

export const GroupContext = createContext(initialState);

const GroupContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GroupContext.Provider value={[state, dispatch]}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContextProvider;
