import React, { useContext, useReducer, createContext } from 'react';
const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
	const { username, messages, message } = action.payload;
	switch (action.type) {
		case 'SET_USERS':
			return {
				...state,
				users : action.payload
			};
		case 'SET_USER_MESSAGES':
			const userCopy2 = [
				...state.users
			];
			const userIndex = userCopy2.findIndex((u) => u.username === username);
			userCopy2[userIndex] = { ...userCopy2[userIndex], messages };
			return {
				...state,
				users : userCopy2
			};
		case 'SET_SELECTED_USER':
			const usersCopy = state.users.map((user) => {
				return {
					...user,
					selected : user.username === action.payload
				};
			});

			return {
				...state,
				users : usersCopy
			};
		case 'ADD_MESSAGE':
			const userCopy3 = [
				...state.users
			];
			const userIndex2 = userCopy3.findIndex((u) => u.username === username);
			let newUser = {
				...userCopy3[userIndex2],
				messages : [
					message,
					...userCopy3[userIndex2].messages
				]
			};
			userCopy3[userIndex2] = newUser;
			return {
				...state,
				users : userCopy3
			};
		default:
			throw new Error(`Unknown action type : ${action.type}`);
	}
};

export const MessageProvider = ({ children }) => {
	const [
		state,
		dispatch
	] = useReducer(messageReducer, { users: null });
	return (
		<MessageDispatchContext.Provider value={dispatch}>
			<MessageStateContext.Provider value={state}>{children}</MessageStateContext.Provider>
		</MessageDispatchContext.Provider>
	);
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
