const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		id: String
		username: String!
		createdAt: String
		token: String
		email: String
		imageUrl: String!
		latestMessage: Message
	}

	type Message {
		id: String!
		content: String!
		to: String!
		from: String!
		createdAt: String!
	}

	type Query {
		getUsers: [User]!
		login(username: String!, password: String!): User!
		getMessages(from: String!): [Message]!
	}

	type Mutation {
		register(username: String!, password: String!, confirmPassword: String!, email: String!): User!
		sendMessage(to: String!, content: String!): Message!
	}

	type Subscription {
		newMessage: Message!
	}
`;
