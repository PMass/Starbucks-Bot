const rolesCache = {}; // { 'guildID-userID': roles }

// Get information on a user based on their roles
module.exports.roles = async (guild, mention, rolesAll) => {
	const guildID = guild.id;
	const userID = mention.id;
	const cachedValue = rolesCache[`${guildID}-${userID}`];
	if (cachedValue) {
		return cachedValue;
	}
	try {
		const member = await guild.members.fetch(mention);
		const allRoles = member.roles.cache;
		const roles = [];
		allRoles.forEach(allRoles => roles.push(allRoles.id));
		const rolesValues = Object.values(rolesAll); // Pull the ID and name of each Role
		let roleName = []; // Create a blank array for the roles of the user
		for (let i = 0; i < roles.length; i++) { // Go through each role and see if the ID matches any of the IDs of other arrays
			roleName.push(checkVariables(rolesValues, roles, i));
		}
		roleName = roleName.filter(x => x !== undefined); // Filter out each array for undefiend values
		rolesCache[`${guildID}-${userID}`] = roleName;
		return roleName;
	}
	catch (err) {
		console.error(err);
		console.error(guild, mention, rolesAll);
	}
};

// Get information on a user based on their roles
module.exports.updtRoles = async (guild, mention, rolesAll) => {
	const guildID = guild.id;
	const userID = mention.id;
	try {
		const member = await guild.members.fetch(mention);
		const allRoles = member.roles.cache;
		const roles = [];
		allRoles.forEach(allRoles => roles.push(allRoles.id));
		const rolesValues = Object.values(rolesAll); // Pull the ID and name of each Group Role/certs/ranks
		let roleName = []; // Create a blank array for the groups/certs/rank of the user
		for (let i = 0; i < roles.length; i++) { // Go through each role and see if the ID matches any of the IDs of other arrays
			roleName.push(checkVariables(rolesValues, roles, i));
		}
		roleName = roleName.filter(x => x !== undefined); // Filter out each array for undefiend values
		rolesCache[`${guildID}-${userID}`] = roleName;
	}
	catch (err) {
		console.error(err);
		console.error(guild, mention, rolesAll);
	}
};

// Get Roles for main groups (on duty, in queue, recruit, doc)
module.exports.rolesGroup = async (guild) => {
	try {
		const rolesGroups = {};
		const cache = guild.roles.cache;
		const verified = {};
		const temp = {};
		const former = {};
		const rank1 = {};
		const rank2 = {};
		const rank3 = {};
		const rank4 = {};
		const barista = {};
		const supervisor = {};
		const customer = {};
		const support = {};
		const USA = {};
		const CAD = {};
		const EMEA = {};
		verified.id = cache.find(role => role.name === 'Verified').id;
		verified.name = cache.find(role => role.name === 'Verified').name;
		temp.id = cache.find(role => role.name === 'Temp Verification').id;
		temp.name = cache.find(role => role.name === 'Temp Verification').name;
		former.id = cache.find(role => role.name === 'Former Verified').id;
		former.name = cache.find(role => role.name === 'Former Verified').name;
		rank1.id = cache.find(role => role.name === '1').id;
		rank1.name = cache.find(role => role.name === '1').name;
		rank2.id = cache.find(role => role.name === '2').id;
		rank2.name = cache.find(role => role.name === '2').name;
		rank3.id = cache.find(role => role.name === '3').id;
		rank3.name = cache.find(role => role.name === '3').name;
		rank4.id = cache.find(role => role.name === '4').id;
		rank4.name = cache.find(role => role.name === '4').name;
		barista.id = cache.find(role => role.name === 'Barista').id;
		barista.name = cache.find(role => role.name === 'Barista').name;
		supervisor.id = cache.find(role => role.name === 'Supervisor').id;
		supervisor.name = cache.find(role => role.name === 'Supervisor').name;
		customer.id = cache.find(role => role.name === 'Customer').id;
		customer.name = cache.find(role => role.name === 'Customer').name;
		support.id = cache.find(role => role.name === 'Non-Retail Partner').id;
		support.name = cache.find(role => role.name === 'Non-Retail Partner').name;
		USA.id = cache.find(role => role.name === 'USA Partner').id;
		USA.name = cache.find(role => role.name === 'USA Partner').name;
		CAD.id = cache.find(role => role.name === 'Canadian Partner').id;
		CAD.name = cache.find(role => role.name === 'Canadian Partner').name;
		EMEA.id = cache.find(role => role.name === 'EMEA Partner').id;
		EMEA.name = cache.find(role => role.name === 'EMEA Partner').name;
		rolesGroups.verified = verified;
		rolesGroups.temp = temp;
		rolesGroups.former = former;
		rolesGroups.rank1 = rank1;
		rolesGroups.rank2 = rank2;
		rolesGroups.rank3 = rank3;
		rolesGroups.rank4 = rank4;
		rolesGroups.barista = barista;
		rolesGroups.supervisor = supervisor;
		rolesGroups.customer = customer;
		rolesGroups.support = support;
		rolesGroups.USA = USA;
		rolesGroups.CAD = CAD;
		rolesGroups.EMEA = EMEA;
		return rolesGroups;
	}
	catch(err) {
		console.error(err);
	}
};

// Internaul function to check variables role IDs aginst a role id array and see matching ones and return the name of the at one
function checkVariables(values, roles, i) { // Take in a role ID and see if it matches any of the IDs in the provided array of values, if it does, return the name, otherwise return undefined
	const result = values.find(({ id }) => id === roles[i]);
	if (result === undefined) {
		// Do nothing
	}
	else {
		return result.name;
	}
}

