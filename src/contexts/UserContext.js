import React, {createContext, useReducer} from 'react';

const reducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
            return {
                isAuthenticated: true,
                token: action.payload.token,
                username: action.payload.username,
                displayMessage: true,
                message: `Pomyślnie zalogowano ${action.payload.username}`
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return {
                isAuthenticated: false,
                token: null,
                username: null,
                displayMessage: true,
                message: 'Pomyślnie wylogowano'
            };
        case 'TIMEOUT':
            return {
                isAuthenticated: false,
                token: null,
                username: null,
                displayMessage: true,
                message: 'Sesja wygasła'
            };
        case 'MESSAGE_CLEAR':
            return {
                ...state,
                displayMessage: false
            };
        default:
            return state;
    };
};

const initialState = {
    isAuthenticated: false,
    token: null,
    username: null,
    displayMessage: false,
    message: null
};

export const UserContext = createContext(initialState);

const User = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <UserContext.Provider value = {[state, dispatch]}>
            {children}
        </UserContext.Provider>
    );
}

export default User;