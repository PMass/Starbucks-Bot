// require the discord.js module and configuration
	const Discord = require('discord.js');
	const config = require('./config.json');
	const sendMessage = require('./send-message')
	const mongo = require('./mongo');
	const fs = require('fs');
	const path = require('path');
	const { promisify } = require('util');

	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const { promisify } = require('util');
	const doc = new GoogleSpreadsheet('17UFx1-SPrUD-9F3nHylfrE8RWUNaXQYf66sq4UPviO0');
	const creds = require('./client_secret.json');

// Internal Modules
	const dbGet = require('./dbGet')
	const dsMsg = require('./dsMsg')
	const dsFunc = require('./dsFunc')
	const verification = require('./verification')

// Server info
	const botID = '794000856516395009'
	const tempVerifiedRole = '795463783149207572'

// Channels
	const channelVerify = '795464681912795156'
	const channelVerifyTemp = '795464295822917672'
	const channelVerifyAdmin = '786423882608410664'
	const channelVerifyLog = '796097870045380668'
	const channelHub = '362693647138816003'

// create a new Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

// when the client is ready, run this code
client.once('ready', () => {
	client.user.setPresence({ activity: { type: 'LISTENING', name: '1 Million Karens'}, status: 'online' }) //Set the bot to online and status
	.catch(console.error);
	console.log(client.user.id);	
	console.log('Ready!');
	await mongo().then((mongoose) => {
		try {
			console.log('Connected to mongo!')
		} finally {
			mongoose.connection.close()
		}
	})
		const baseFile = 'command-base.js'
		const commandBase = require(`./commands/${baseFile}`)
		const readCommands = (dir) => {
	  		const files = fs.readdirSync(path.join(__dirname, dir))
	  		for (const file of files) {
	    		const stat = fs.lstatSync(path.join(__dirname, dir, file))
	    		if (stat.isDirectory()) {
	      			readCommands(path.join(dir, file))
	    		} else if (file !== baseFile) {
	      			const option = require(path.join(__dirname, dir, file))
	      			commandBase(client, option)
	    		}
	  		}
		}
  readCommands('commands')
});

client.login(config.token);

client.on('message', message => {
	if (message.author.id != botID){ // If not the bot
		const guild = message.guild // get the guild object
		const channels = await dbGet.channels(guild.id)
		if (message.channel.id == channels.temp) { //If in the temp channel and not the bot
			message.delete({ timeout: 100 }) //Remove the message
			const roles = await dbGet.roles(guild.id)
			const userID = message.author.id // Their ID			
			verification.save(userID, message.content, guild) // Go save this information to google
			dsFunc.takeRole(guild, userID, roles.temp)
			dsMsg.guildMessage(guild, `<@${userID}> lost verified role after sending message.`, "log")
		}
		if (message.channel.id == channels.verify && message.content != '$verify' ) { // If in the proper channel  but not the proper message remove it and log it
			message.delete({ timeout: 100 })
			dsMsg.guildMessage(guild, `<@${message.author.id}> sent random message in Verify channel. It was ${message.content}`, "log")
		}
	}
});

client.on('messageReactionAdd', (messageReaction, user) => { //when we react
   let message = messageReaction.message, emoji = messageReaction.emoji; //Log this shit
	const guild = message.guild // get the guild object	
 	if (user.id != botID && message.channel.id == channelVerifyAdmin) { // If not the bot
		message.delete({ timeout: 5 }) //Remove the message we reacting to
    	if (emoji.name == '🟢') { //Green Circle
			dsMsg.guildMessage(guild, `${user.tag} Approved Verification.`, "log")
			console.log(user.tag + ' Approved Verifcation!'); //Approved verificion
			var status = 'Approved' //Set status to approved
   		}
    	if (emoji.name == '🔴') { //Red Circle
    		dsMsg.guildMessage(guild, `${user.tag} Denied Verification`, "log")
			console.log(user.tag + ' Denied Verifcation!'); //Log status
			var status = 'Denied' //Set status to denied
   		}
   		console.log(status) // Log if approved or denied
   		verification.readAndUpdate(message.id, status, guild) //Run function to log this on google sheets
   	}
});


