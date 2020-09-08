import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import Register from './pages/Register';
import ApolloProvider from './ApolloProvider';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './context/auth';
import { MessageProvider } from './context/message';
import DynamicRoute from './utils/DynamicRoute';

function App() {
	return (
		<ApolloProvider>
			<AuthProvider>
				<MessageProvider>
					<Router>
						<Container className="pt-5">
							<Switch>
								<DynamicRoute exact path="/" component={Home} authenticated />
								<DynamicRoute path="/register" component={Register} guest />
								<DynamicRoute path="/login" component={Login} guest />
							</Switch>
						</Container>
					</Router>
				</MessageProvider>
			</AuthProvider>
		</ApolloProvider>
	);
}

export default App;
