const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');
require('dotenv').config();

// const { find } = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');
const checkAuth = require('../../utils/check-auth');
const Message = require('../../models/Message');

function generateToken(user) {
	return jwt.sign(
		{
			id       : user.id,
			email    : user.email,
			username : user.username
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: 2 * 60 * 60 }
	);
}

module.exports = {
	Query    : {
		getUsers : async (_, __, context, info) => {
			try {
				console.log(info);
				const user = checkAuth(context);
				const users = await User.find({}).select([
					'-email',
					'-password'
				]);
				// console.log(user);
				const allUserMessages = await Message.find({
					$or : [
						{ from: user.username },
						{ to: user.username }
					]
				});
				// console.log(allUserMessages.length);
				const transformedUsers = users.filter((u) => u.username !== user.username).map((otherUser) => {
					const latestMessage = allUserMessages.find(
						(m) => m.from === otherUser.username || m.to === otherUser.username
					);
					otherUser.latestMessage = latestMessage;
					return otherUser;
				});
				return transformedUsers;
			} catch (err) {
				console.log(err);
				throw err;
			}
		},

		login    : async (_, { username, password }) => {
			try {
				const customErrors = {};
				const { errors, valid } = validateLoginInput(username, password);
				if (!valid) {
					throw errors;
				}
				const user = await User.findOne({ username });
				if (!user) {
					customErrors.username = "User with this username doesn't exist !";
					throw customErrors;
				}
				const match = await bcrypt.compare(password, user.password);
				if (!match) {
					customErrors.password = 'Wrong credentials !';
					// console.log('it runs');
					throw customErrors;
				}
				const token = generateToken(user);
				return {
					...user._doc,
					id    : user._id,
					token
				};
			} catch (err) {
				console.log(err);
				throw new UserInputError('Bad Input !', { errors: err });
			}
		}
	},
	Mutation : {
		async register(_, { email, password, confirmPassword, username }) {
			try {
				// TODO: make sure user already doesn't exist
				let customErrors = {};
				const user = await User.findOne({ username });
				if (user) {
					customErrors.username = 'this username is taken !';
				}
				const userWithEmail = await User.findOne({ email });
				if (userWithEmail) {
					customErrors.email = 'user with given email already exists!';
				}
				// TODO: validate user data
				const { errors, valid } = validateRegisterInput(username, password, confirmPassword, email);
				if (!valid || Object.keys(customErrors).length > 0) {
					throw { ...customErrors, ...errors };
				}
				//hash the password
				password = await bcrypt.hash(password, 12);
				const newUser = await User.create({
					email,
					password,
					username
				});
				// assign jwt token
				const token = generateToken(newUser);
				return {
					...newUser._doc,
					id    : newUser._id,
					token
				};
			} catch (err) {
				console.log(err);
				throw new UserInputError('Bad Input !', { errors: err });
			}
		}
	}
};
