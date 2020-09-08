import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { Link } from 'react-router-dom';

const LOGIN_USER = gql`
	query login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			username
			email
			token
		}
	}
`;

function Login(props) {
	const dispatch = useAuthDispatch();
	const [
		errors,
		setErrors
	] = useState({});
	const [
		variables,
		setVariables
	] = useState({
		username : '',
		password : ''
	});
	const [
		loginUser,
		{ loading }
	] = useLazyQuery(LOGIN_USER, {
		onError(err) {
			// console.log(err.graphQLErrors[0].extensions.errors);
			setErrors(err.graphQLErrors[0].extensions.errors);
		},
		onCompleted(data) {
			dispatch({ type: 'LOGIN', payload: data.login });
			// console.log(state);
			props.history.push('/');
		}
	});
	const submitLoginForm = (e) => {
		e.preventDefault();
		// console.log(variables);
		loginUser({ variables });
	};
	return (
		<Row className="bg-white p-5 justify-content-center">
			<Col sm={10} md={8} lg={6}>
				<h1 className="text-center">Login</h1>
				<Form onSubmit={submitLoginForm}>
					<Form.Group>
						<Form.Label className={`font-weight-bold ${errors.username && 'text-danger'}`}>
							{
								errors.username ? errors.username :
								'Username'}
						</Form.Label>
						<Form.Control
							type="text"
							className={errors.username && 'is-invalid'}
							placeholder="Enter username"
							value={variables.username}
							onChange={(e) => setVariables({ ...variables, username: e.target.value })}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label className={`font-weight-bold ${errors.password && 'text-danger'}`}>
							{
								errors.password ? errors.password :
								'Password'}
						</Form.Label>
						<Form.Control
							type="password"
							className={errors.password && 'is-invalid'}
							placeholder="Enter password"
							value={variables.password}
							onChange={(e) => setVariables({ ...variables, password: e.target.value })}
						/>
					</Form.Group>
					<div className="text-center">
						<Button type="submit" variant="success" disabled={loading}>
							{
								loading ? 'Loading..' :
								'Login'}
						</Button>
						<br />
						<small>
							Don't have an account ? <Link to="/register">Register</Link>
						</small>
					</div>
				</Form>
			</Col>
		</Row>
	);
}

export default Login;
