const mongo = require('./mongo');
const userInfoSchema = require('./schemas/user-info-schema');
const guildInfoSchema = require('./schemas/guild-info-schema');
const verificationSchema = require('./schemas/verifcation-schema');
const dbAdd = require('./dbAdd');

const channelsCache = {}; // { 'guildID': channels }
const rolesCache = {}; // { 'guildID': roles }

// Find all users who are of a current status on the On Duty Database
module.exports.verification = async (guildID, message) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log('Running dbGet verification()');
			const result = await verificationSchema.findOne(
				{
					guildID,
					message,
				});
			return result;
		}
		catch (err) {
			console.log(err);
		}
	});
};

// Find a the guilds discord roles for clocked on and in queue from the Guild database
module.exports.roles = async (guildID) => {
	const cachedValue = rolesCache[`${guildID}`];
	if (cachedValue) {
		return cachedValue;
	}
	return await mongo().then(async (mongoose) => {
		try {
			console.log('Running dbGet roles()');
			const result = await guildInfoSchema.findOne({
				guildID,
			});
			let roles = {};
			if (result) {
				roles = result.roles;
			}
			else {
				console.log('No Roles Found');
			}
			rolesCache[`${guildID}`] = roles;
			return roles;
		}
		catch (err) {
			console.log(err);
		}
	});
};

// Find the guild channels for the clock, error, log and spam from the Guild database
module.exports.channels = async (guildID) => {
	const cachedValue = channelsCache[`${guildID}`];
	if (cachedValue) {
		return cachedValue;
	}
	return await mongo().then(async (mongoose) => {
		try {
			console.log('Running dbGet channels()');
			const result = await guildInfoSchema.findOne({
				guildID,
			});
			let channels = {};
			if (result) {
				channels = result.channels;
			}
			else {
				console.log('No Server Found');
			}
			channelsCache[`${guildID}`] = channels;
			return channels;
		}
		catch (err) {
			console.log(err);
		}
	});
};

// Find the guild channels for the clock, error, log and spam from the Guild database
module.exports.timeAndMessages = async (guildID, userID, userRoles) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log('Running dbGet timeAndMessages()');
			const result = await userInfoSchema.findOne({
				guildID,
				userID,
			});
			const now = new Date().getTime();
			let join = '';
			if (result) {
				join = result.join;
				messages = result.messages;
			}
			if (join === undefined) {
				await dbAdd.user(guildID, userID, userRoles);
				join = now;
				var messages = 0;
			}
			const total = now - join;
			return [total, messages];
		}
		catch(err) {
			console.error(err);
		}
	});
};

