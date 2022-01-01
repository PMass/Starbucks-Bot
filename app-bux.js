/* eslint-disable no-mixed-spaces-and-tabs */
// require the discord.js module and configuration
const Discord = require('discord.js');
const mongo = require('./mongo');

const fs = require('fs');
const path = require('path');

const config = require('./config.json');

// Internal Modules
const dsMsg = require('./dsMsg');
const fnOther = require('./functions-other');
const verification = require('./verification');
const messageCount = require('./message-counter');
let botID = '';

// create a new Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });


// when the client is ready, run this code
client.once('ready', async () => {
	client.user.setPresence({ activity: { type: 'LISTENING', name: '1 Million Karens' }, status: 'online' }) // Set the bot to online and status
		.catch(console.error);
	console.log(client.user.id);
	console.log('Ready!');
	await mongo().then((mongoose) => {
		try {
			console.log('Connected to mongo!');
		}
		finally {
			mongoose.connection.close();
		}
	});
	const baseFile = 'command-base.js';
	const commandBase = require(`./commands/${baseFile}`);
	const readCommands = (dir) => {
	  		const files = fs.readdirSync(path.join(__dirname, dir));
	  		for (const file of files) {
	    		const stat = fs.lstatSync(path.join(__dirname, dir, file));
	    		if (stat.isDirectory()) {
	      			readCommands(path.join(dir, file));
	    		}
			else if (file !== baseFile) {
	      			const option = require(path.join(__dirname, dir, file));
	      			commandBase(client, option);
	    		}
	  		}
	};
	messageCount(client);
	readCommands('commands');
	botID = client.user.id;
});

client.login(config.token);

client.on('message', message => {
	if (message.author.id != botID) { // If not the bot
		if (message.channel.name == 'temp-verification') { // If in the temp channel and not the bot
			message.delete({ timeout: 100 }); // Remove the message
			fnOther.verify(message);
		}
		if (message.channel.name == 'verification' && message.content != '$verify') { // If in the proper channel  but not the proper message remove it and log it
			const guild = message.guild; // get the guild object
			message.delete({ timeout: 100 });
			dsMsg.guildMessage(guild, `<@${message.author.id}> sent random message in Verify channel. It was " ${message.content} " `, 'log');
		}
		if (message.content.toUpperCase() == '$RESET' && message.channel.name == 'boot-spam') {resetBot(message.channel);}
	}
});

client.on('messageReactionAdd', (messageReaction, user) => { // when we react
	const message = messageReaction.message, emoji = messageReaction.emoji; // Log this shit
	const guild = message.guild; // get the guild object
 	if (user.id != botID && message.channel.name == 'verification-queue') { // If not the bot
		message.delete({ timeout: 5 }); // Remove the message we reacting to
		let status = '';
    	if (emoji.name == '🟢') { // Green Circle
			dsMsg.guildMessage(guild, `${user.tag} Approved Verification.`, 'log');
			console.log(user.tag + ' Approved Verifcation!'); // Approved verificion
			status = 'Approved'; // Set status to approved
   		}
    	if (emoji.name == '🔴') { // Red Circle
    		dsMsg.guildMessage(guild, `${user.tag} Denied Verification`, 'log');
			console.log(user.tag + ' Denied Verifcation!'); // Log status
			status = 'Denied'; // Set status to denied
   		}
   		console.log(status); // Log if approved or denied
   		const mention = message.mentions.members.first();

   		verification.readAndUpdate(message.id, status, guild, mention, user); // Run function to log this on google sheets
   	}
});

// set message listener
client.on('message', message => {
	switch(message.content.toUpperCase()) {
	case '?RESET':


        // ... other commands
	}
});

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
	// send channel a message that you're resetting bot [optional]
	channel.send('Resetting...')
		.then(msg => client.destroy())
		.then(() => client.login(config.token));
}
