const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};
const reqDate = {
	type: Date,
	required: true,
};
const reqNum = {
	type: Number,
	required: true,
};

const userInfoSchema = mongoose.Schema({
	guildID: reqString,
	userID: reqString,
	roles: Object,
	join: reqDate,
	time: reqString,
	messages: reqNum,
	coins: reqNum,
	items: Object,
	rank: reqString,
});

module.exports = mongoose.model('user-info', userInfoSchema);