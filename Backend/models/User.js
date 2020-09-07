const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema(
	{
		email    : { type: String, required: true, unique: true },
		username : {
			type     : String,
			required : true,
			unique   : true
		},
		password : {
			type     : String,
			required : true
		},
		imageUrl : {
			type    : String,
			default : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
		}
	},
	{
		timestamps : true
	}
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
