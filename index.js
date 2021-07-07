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
	const dbAdd = require('./dbAdd')
	const dsMsg = require('./dsMsg')


// Server info
	const serverID = '294226224446701568'
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
	var userid = message.author.id // Their ID
	const guild = message.guild // get the guild object
  	const channelTempFull = guild.channels.cache.get(channelVerifyTemp)  // Full information for temp channel		
  	const channelLog = guild.channels.cache.get(channelVerifyLog)  // Full information for temp channel		
	const member = message.member // Server member info
	const tag = `<@${member.id}>` // Create a tag for them
		if (message.channel.id == channelVerify && message.content == '$verify') { // If in the proper channel and proper message
			message.delete({ timeout: 150 }) // Remove message
			console.log('Gave Temp verified role to ' + message.author.tag) // Log in the console that we giving them the temp role to them
 			member.roles.add(tempVerifiedRole); // Give them the temp verified role
 			sendMessage(channelTempFull,`${tag} you have 25 seconds to paste a link to your verification here! It will be remove after you post it`, 15) // Send a message in the temp channel
 			sendMessage(channelLog,`${tag} started verification.`, -1) // Send a message in the temp channel
			sleep(60000).then(() => { // wait for 30 seconds
				sendMessage(channelLog,`${tag} lost verified role after timeout.`, -1) // Send a message in the temp channel
				console.log('Removed temp verified role for ' + message.author.tag)
 				member.roles.remove(tempVerifiedRole); //Remove the temp role if they have waited longer than 30 seconds
			});
		}
		if (message.channel.id == channelVerifyTemp) { //If in the temp channel and not the bot
			var verificationURL = message.content // Save the content of the message
			saveVerification(userid, verificationURL, guild) // Go save this information to google
			message.delete({ timeout: 150 }) //Remove the message
			sendMessage(channelLog,`${tag} lost verified role after sending message.`, -1) // Send a message in the temp channel	
			console.log('Logged verification URL temp verified role for ' + message.author.tag) // log it
			member.roles.remove(tempVerifiedRole); //Remove their role
		}
		if (message.channel.id == channelVerify && message.content != '$verify' ) { // If in the proper channel and proper message
			message.delete({ timeout: 500 }) // Remove all other messages after 30 seconds
			sendMessage(channelLog,`${tag} sent random message in Verify channel.`, -1) // Send a message in the temp channel

		}
	}
});

client.on('messageReactionAdd', (messageReaction, user) => { //when we react
   let message = messageReaction.message, emoji = messageReaction.emoji; //Log this shit
	const guild = message.guild // get the guild object
  	const channelLog = guild.channels.cache.get(channelVerifyLog)  // Full information for temp channel		
 	if (user.id != botID && message.channel.id == channelVerifyAdmin) { // If not the bot
		message.delete({ timeout: 5 }) //Remove the message we reacting to
    	if (emoji.name == '🟢') { //Green Circle
			sendMessage(channelLog,`${user.tag} Approved Verification.`, -1) // Send a message in the temp channel
			console.log(user.tag + ' Approved Verifcation!'); //Approved verificion
			var status = 'Approved' //Set status to approved
   		}
    	if (emoji.name == '🔴') { //Red Circle
    		sendMessage(channelLog,`${user.tag} Denied Verification.`, -1) // Send a message in the temp channel
			console.log(user.tag + ' Denied Verifcation!'); //Log status
			var status = 'Aenied' //Set status to denied
   		}
   		console.log(status) // Log if approved or denied
   		readCells(message.id, status, guild.id) //Run function to log this on google sheets
   	}
});
//Function for saving the information
async function saveVerification(userid, verificationURL, guild) {
	const verify = {}
	try {
	   verify.user = userid
	   verify.content = verificationURL
	  	const channelFull = guild.channels.cache.get(channelVerifyAdmin); 	//Channel for sending verification log message
	  	const channelLog = guild.channels.cache.get(channelVerifyLog);  // Full information for temp channel		
		const tag = `<@${userid}>` //Tag of who submitted it
	  	verify.time = formatted_date(); //Create a date for when this was made
		let sent = await channelFull.send(`${tag} submitted a new verifcation for approval ` + verificationURL) //sending the message and adding reactions
		verify.ID = sent.id; //Getting message ID
		await sent.react('🟢'); //Green
		await sent.react('🔴'); //Red
	  	await dbAdd.verification(guildID, verification)
	  	console.log('Verifcation Logged') //Log it
	   sendMessage(channelLog,`Logged Verification for ${tag} .`, -1) // Send a message in the temp channel
	} catch (error) {
		console.log(error);
    	console.log("ERROR! Unable to Save Intake"); //Log it if their was error
		sendMessage(channelLog,`Unable to Save Intake for ${tag} .`, -1) // Send a message in the temp channel
	}
}

async function readCells(messageID, status, guildID) {
	try {
	const verify = await dbGet.verification(guildID, messageID)
	var time = formatted_date() //Date veriable 
	await dbUpdate.verification(guildID, messageID, status, time)
 	const tag = `<@${verify.user}>` // Create a tag for them  
   sendMessage(channelLog,`Read spreadsheet and removed verification for ${tag}`, -1) // Send a message in the temp channel
 	assignVerified(verify.user, status) // run the function to assign roles
	} catch (error) { // Error Catching
		console.log(error)
    	console.log("ERROR! Unable to Read Information from Cells")
 		sendMessage(channelLog,`Error Reading Cells Other Reason`, -1) // Send a message in the temp channel

	}
}

//Assign verified status, or let them know it was denied
function assignVerified(userid,status){
 	const guild = client.guilds.cache.get(serverID) // get the guild object
 	const member = guild.members.cache.get(userid) //Memeber who we are selecting
 	const channelID = channelVerify //Main Verification channel ID
  	const channelFull = guild.channels.cache.get(channelID) //Main Verification channel full information
	const channelHubFull = guild.channels.cache.get(channelHub) //Main Verification channel full information
  	const tag = `<@${userid}>` //tag variable who we are tagging to let them know the statuts
	if(status == 'approved'){ //If approved
		member.roles.add('786675086823260160'); //Give the role
		//Send message then nuke after 12 Hours
		sendMessage(channelFull, `${tag} You verification for partner has been approved! Please reivew our rules at <#425748759771873300>`, 43200)
		sendMessage(channelHubFull, `Please welcome ${tag} to the Parter hub`, 3600)
	} else { //If not approved or anything else
		//Send message then nuke after 12 Hours
  		sendMessage(channelFull, `${tag} You verification for partner has been denied. Please review our qualifications before you resubmit!`, 43200)
	}
}
//Create a date
function formatted_date(){
   var result=""; //New variable
   var d = new Date(); //Full ISO date
   //Formate the date to how google wants to see it
   result += (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+
             " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
   return result; //Return
}
//Cause the process to wait for some time while something is processes
function sleep(ms) {

	return new Promise(resolve => setTimeout(resolve, ms));
}