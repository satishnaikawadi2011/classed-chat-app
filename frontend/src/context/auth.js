import React, { useContext, useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;
const token = localStorage.getItem('token');
if (token) {
	const decodedToken = jwtDecode(token);
	const expiresAt = new Date(decodedToken.exp * 1000);
	// console.log(expiresAt);
	if (new Date() > expiresAt) {
		localStorage.removeItem('token');
	}
	else {
		user = decodedToken;
	}
}

const authReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			// console.log(action.payload);
			localStorage.setItem('token', action.payload.token);
			return {
				...state,
				user : action.payload
			};
		case 'LOGOUT':
			localStorage.removeItem('token');
			return {
				...state,
				user : null
			};
		default:
			throw new Error(`Unknown action type : ${action.type}`);
	}
};

export const AuthProvider = ({ children }) => {
	const [
		state,
		dispatch
	] = useReducer(authReducer, { user });
	return (
		<AuthDispatchContext.Provider value={dispatch}>
			<AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
		</AuthDispatchContext.Provider>
	);
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
