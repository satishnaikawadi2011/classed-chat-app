import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import { Link } from 'react-router-dom';
import { Button, Row } from 'react-bootstrap';
import Users from '../components/Users';
import Messages from '../components/Messages';

function Home(props) {
	const dispatch = useAuthDispatch();
	const logout = () => {
		dispatch({ type: 'LOGOUT' });
		// props.history.push('/login');
		window.location.href = '/login';
	};
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
