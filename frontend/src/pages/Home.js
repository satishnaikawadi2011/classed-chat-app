import React, { useEffect } from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import { Link } from 'react-router-dom';
import { Button, Row } from 'react-bootstrap';
import Users from '../components/Users';
import Messages from '../components/Messages';
import { gql, useSubscription } from '@apollo/client';
import { useMessageDispatch } from '../context/message';

const NEW_MESSAGE = gql`
	subscription newMessage {
		newMessage {
			id
			createdAt
			from
			to
			content
		}
	}
`;

function Home(props) {
	const authDispatch = useAuthDispatch();
	const msgDispatch = useMessageDispatch();
	const { user } = useAuthState();
	const { data: msgData, error: msgError } = useSubscription(NEW_MESSAGE);
	const logout = () => {
		authDispatch({ type: 'LOGOUT' });
		// props.history.push('/login');
		window.location.href = '/login';
	};

	useEffect(
		() => {
			if (msgError) {
				console.log(msgError);
			}

			if (msgData) {
				const message = msgData.newMessage;
				const otherUser =

						user.username === message.to ? message.from :
						message.to;
				msgDispatch({
					type    : 'ADD_MESSAGE',
					payload : {
						username : otherUser,
						message
					}
				});
			}
		},
		[
			msgData,
			msgError
		]
	);
	return (
		<React.Fragment>
			<Row className="bg-white justify-content-around mb-1">
				<Link to="/login">
					<Button variant="link">Login</Button>
				</Link>
				<Link to="/register">
					<Button variant="link">Register</Button>
				</Link>
				<Button onClick={logout} variant="link">
					Logout
				</Button>
			</Row>
			<Row className="bg-white">
				<Users />
				<Messages />
			</Row>
		</React.Fragment>
	);
}

export default Home;
