const checkAuth = require('../../utils/check-auth');
const Message = require('../../models/Message');
const { UserInputError, AuthenticationError } = require('apollo-server');
const User = require('../../models/User');
require('dotenv').config();

module.exports = {
	Query    : {
		getMessages : async (parent, { from }, context) => {
			try {
				const user = checkAuth(context);
				const otherUser = await User.findOne({ username: from });
				if (!otherUser) {
					throw new UserInputError('user not found !');
				}
				const messages = await Message.find({
					from : {
						$in : [
							user.username,
							otherUser.username
						]
					},
					to   : {
						$in : [
							user.username,
							otherUser.username
						]
					}
				}).sort({ createdAt: -1 });
				// console.log({ ...messages[0] });
				return messages.map((message) => {
					return { ...message._doc, id: message._id };
				});
			} catch (err) {
				console.log(err);
				throw err;
			}
		}
	},
	Mutation : {
		sendMessage : async (parent, args, context) => {
			try {
				const { to, content } = args;
				const user = checkAuth(context);

				if (!user) {
					throw new AuthenticationError('Unauthenticated !');
				}
				const recepient = await User.findOne({ username: to });
				if (!recepient) {
					throw new UserInputError('User not found !');
				}
				else if (recepient.username === user.username) {
					throw new UserInputError('You cannot send message to yourself !');
				}

				if (content.trim === '') {
					throw new UserInputError('Message is empty !');
				}

				const message = await Message.create({
					to,
					from    : user.username,
					content
				});
				return {
					id : message._id,
					...message._doc
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		}
	}
};
