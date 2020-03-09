import React, { createContext, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("role", action.payload.role);
      return {
        isAuthenticated: true,
        token: action.payload.token,
        username: action.payload.username,
        role: action.payload.role,
        displayMessage: true,
        message: `Pomyślnie zalogowano ${action.payload.username}`
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return {
        isAuthenticated: false,
        token: null,
        username: null,
        role: null,
        displayMessage: true,
        message: "Pomyślnie wylogowano"
      };
    case "TIMEOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return {
        isAuthenticated: false,
        token: null,
        username: null,
        role: null,
        displayMessage: true,
        message: "Sesja wygasła"
      };
    case "MESSAGE_CLEAR":
      return {
        ...state,
        displayMessage: false
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  token: null,
  username: null,
  role: null,
  displayMessage: false,
  message: null
};

export const UserContext = createContext(initialState);

const User = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");
  let role = localStorage.getItem("role");

  if (token && username && role) {
    dispatch({
      type: "LOGIN",
      payload: {
        token: token,
        username: username,
        role: role
      }
    });
  }

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export default User;
