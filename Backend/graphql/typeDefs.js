const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		id: ID
		username: String!
		createdAt: String
		token: String
		email: String!
	}

	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}

	type Query {
		getUsers: [User]!
		login(username: String!, password: String!): User!
	}

	type Mutation {
		register(registerInput: RegisterInput!): User!
	}
`;
