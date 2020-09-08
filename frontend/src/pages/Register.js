import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
	mutation register($username: String!, $password: String!, $confirmPassword: String!, $email: String!) {
		register(username: $username, password: $password, confirmPassword: $confirmPassword, email: $email) {
			username
			email
		}
	}
`;

function Register(props) {
	const [
		errors,
		setErrors
	] = useState({});
	const [
		variables,
		setVariables
	] = useState({
		email           : '',
		username        : '',
		password        : '',
		confirmPassword : ''
	});
	const [
		registerUser,
		{ loading }
	] = useMutation(REGISTER_USER, {
		update(_, res) {
			// console.log(res);
			props.history.push('/login');
		},
		onError(err) {
			// console.log(err.graphQLErrors[0].extensions.errors);
			setErrors(err.graphQLErrors[0].extensions.errors);
		}
	});
	const submitRegisterForm = (e) => {
		e.preventDefault();
		// console.log(variables);
		registerUser({ variables });
	};
	return (
		<Row className="bg-white p-5 justify-content-center">
			<Col sm={10} md={8} lg={6}>
				<h1 className="text-center">Register</h1>
				<Form onSubmit={submitRegisterForm}>
					<Form.Group>
						<Form.Label className={`font-weight-bold ${errors.email && 'text-danger'}`}>
							{
								errors.email ? errors.email :
								'Email address'}
						</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email"
							className={errors.email && 'is-invalid'}
							value={variables.email}
							onChange={(e) => setVariables({ ...variables, email: e.target.value })}
						/>
					</Form.Group>
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
					<Form.Group>
						<Form.Label className={`font-weight-bold ${errors.confirmPassword && 'text-danger'}`}>
							{' '}
							{
								errors.confirmPassword ? errors.confirmPassword :
								'Confirm Password'}
						</Form.Label>
						<Form.Control
							type="password"
							className={errors.confirmPassword && 'is-invalid'}
							placeholder="Confrim password"
							value={variables.confirmPassword}
							onChange={(e) => setVariables({ ...variables, confirmPassword: e.target.value })}
						/>
					</Form.Group>
					<div className="text-center">
						<Button type="submit" variant="success" disabled={loading}>
							{
								loading ? 'Loading..' :
								'Submit'}
						</Button>
						<br />
						<small>
							Already have an account ? <Link to="/login">Login</Link>
						</small>
					</div>
				</Form>
			</Col>
		</Row>
	);
}

export default Register;
