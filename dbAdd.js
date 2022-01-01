const mongo = require('./mongo');
const userInfoSchema = require('./schemas/user-info-schema');
const guildInfoSchema = require('./schemas/guild-info-schema');
const storeSchema = require('./schemas/store-schema');
const verificationSchema = require('./schemas/verifcation-schema');


// Add a server to the Guild Database
module.exports.setup = async (guildID, roles, channels) => {
	return await mongo().then(async () => {
		try {
			console.log('Running dbAdd setup()');
			await guildInfoSchema.findOneAndUpdate(
				{
					guildID,
				},
				{
					guildID,
					roles,
					channels,
				},
				{
					upsert: true,
					new: true,
				},
			);
		}
		catch (err) {
			console.log(err);
		}
	});
};

// Add an item to the shop
module.exports.items = async (guildID, name, cost, other) => {
	return await mongo().then(async () => {
		try {
			console.log('Running dbAdd items()');
			await storeSchema.findOneAndUpdate(
				{
					guildID,
					name,
				},
				{
					guildID,
					name,
					cost,
					other,
				},
				{
					upsert: true,
					new: true,
				},
			);
		}
		catch (err) {
			console.log(err);
		}
	});
};

// Add an item to the shop
module.exports.user = async (guildID, userID, roles) => {
	return await mongo().then(async () => {
		try {
			console.log('Running dbAdd user()');
			const join = new Date().getTime();
			const time = 0;
			const messages = 1;
			const coins = 1;
			const items = {};
			const rank = 'rank 1';
			await userInfoSchema.findOneAndUpdate(
				{
					guildID,
					userID,
				},
				{
					guildID,
					userID,
					roles,
					join,
					time,
					messages,
					coins,
					items,
					rank,
				},
				{
					upsert: true,
					new: true,
				},
			);
		}
		catch (err) {
			console.log(err);
		}
	});
};

// Add an item to the shop
module.exports.verification = async (guildID, verify) => {
	return await mongo().then(async () => {
		try {
			console.log('Running dbAdd verification()');
			const message = verify.ID;
			const userID = verify.user;
			const time = verify.time;
			const url = verify.content;
			const status = 'awaiting approval';
			await verificationSchema.findOneAndUpdate(
				{
					guildID,
					message,
				},
				{
					guildID,
					message,
					userID,
					time,
					url,
					status,
				},
				{
					upsert: true,
					new: true,
				},
			);
		}
		catch (err) {
			console.log(err);
		}
	});
};

