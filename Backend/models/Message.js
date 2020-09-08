const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema(
	{
		content : {
			type     : String,
			required : true
		},
		from    : {
			type     : String,
			required : true
		},
		to      : {
			type     : String,
			required : true
		}
	},
	{
		timestamps : true
	}
);

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;
