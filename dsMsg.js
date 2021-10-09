const dbGet = require('./dbGet');

// Send message based on channel and a guild
module.exports.guildMessage = async (guild, text, msgType, duration = -1) => {
	try {
		const channels = await dbGet.channels(guild.id);
		let ch = 0;
		switch (msgType) {
		case 'verify':
			ch = guild.channels.cache.get(channels.verify);
			break;
		case 'verifyTemp':
			ch = guild.channels.cache.get(channels.temp);
			break;
		case 'hub':
			ch = guild.channels.cache.get(channels.hub);
			break;
		case 'admin':
			ch = guild.channels.cache.get(channels.admin);
			break;
		case 'log':
			ch = guild.channels.cache.get(channels.log);
			break;
		default:
			ch = guild.channels.cache.get(msgType);
			console.log('ERROR: No channel specified for Guild Message, using message channel');
		}
		const msg = await ch.send(text);
		if (duration === -1) {
			return msg;
		}
		setTimeout(() => {
			msg.delete();
		}, 1000 * duration);
	}
	catch(err) {
		console.error(err);
	}
};

// Send a discord message and log a response
module.exports.response = async (message, text) => {
	try {
		const filter = m => m.author.id === message.author.id;
		const q = await message.channel.send(text);
		const newMsg = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 60000,
			errors: ['time'],
		});
		const responseMsg = await newMsg.first();
		q.delete({ timeout: 200 });
		const content = responseMsg.content;
		responseMsg.delete({ timeout: 200 });
		return content;
	}
	catch(err) {
		message.channel.send('Timed out');
		console.error(err);
	}
};


// Send a profile message for the user mentioned
module.exports.store = async (channel, items, guild) => {
	console.log('Running profileMessage()');
	try {
		const length = items.length;
		const date = new Date();
		const field = [];
		for (let i = 0; i < length; i++) { // Go through each role and see if the ID matches any of the IDs of other arrays
			const item = {};
			const stock = items[i].stock;
			item.name = items[i].name;
			const cost = items[i].cost;
			item.value = `Cost: ${cost}\nStock: ${stock}`;
			item.inline = true;
			field[i] = item;
		}
		const embed = {
			'title': 'Starbucks Discord Store',
			'color': 1793568,
			'timestamp': `${date}`,
			'thumbnail': {
				'url': `${guild.iconURL()}`,
			},
			'fields': field,
		};
		await channel.send({ embed });
		return;
	}
	catch(err) {
		console.error(err);
	}
};

