import React, { createContext, useReducer, useEffect } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        user: {
          isAuthenticated: false,
          token: null,
          username: null,
          role: null
        },
        message: {
          displayMessage: false,
          message: "",
          type: "success"
        }
      };
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("role", action.payload.role);
      return {
        user: {
          isAuthenticated: true,
          token: action.payload.token,
          username: action.payload.username,
          role: action.payload.role
        },
        message: {
          displayMessage: true,
          message: `Pomyślnie zalogowano ${action.payload.username}`,
          type: "success"
        }
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return {
        user: {
          isAuthenticated: false,
          token: null,
          username: null,
          role: null
        },
        message: {
          displayMessage: true,
          message: "Pomyślnie wylogowano",
          type: "success"
        }
      };
    case "TIMEOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return {
        user: {
          isAuthenticated: false,
          token: null,
          username: null,
          role: null
        },
        message: {
          displayMessage: true,
          message: "Sesja wygasła",
          type: "danger"
        }
      };
    case "MESSAGE":
      return {
        ...state,
        message: {
          displayMessage: true,
          message: action.payload.message,
          type: action.payload.type
        }
      };
    case "MESSAGE_CLEAR":
      return {
        ...state,
        message: {
          displayMessage: false,
          message: "",
          type: "success"
        }
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  message: {
    displayMessage: false,
    message: null,
    type: "success"
  }
};

export const UserContext = createContext(initialState);

const User = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
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
    } else {
      dispatch({ type: "INIT" });
    }
  }, []);

  if (state.user === null) return null;
  else
    return (
      <UserContext.Provider value={[state, dispatch]}>
        {children}
      </UserContext.Provider>
    );
};

export default User;
