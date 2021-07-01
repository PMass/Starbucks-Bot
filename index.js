// require the discord.js module and configuration
	const Discord = require('discord.js');
	const config = require('./config.json');
	const sendMessage = require('./send-message')

	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const { promisify } = require('util');
	const doc = new GoogleSpreadsheet('17UFx1-SPrUD-9F3nHylfrE8RWUNaXQYf66sq4UPviO0');
	const creds = require('./client_secret.json');

// Server info
	const serverID = '294226224446701568'
	const botID = '794000856516395009'
	const tempVerifiedRole = '795463783149207572'

// Channels
	const channelVerify = '795464681912795156'
	const channelVerifyTemp = '795464295822917672'
	const channelVerifyAdmin = '786423882608410664'
	const channelVerifyLog = '796097870045380668'

// create a new Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

// when the client is ready, run this code
client.once('ready', () => {
	client.user.setPresence({ activity: { type: 'LISTENING', name: '1 Million Karens'}, status: 'online' }) //Set the bot to online and status
	.catch(console.error);	
	console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
	if (message.author.id != botID){ // If not the bot
	var user = message.author // Messages sender
	var userid = message.author.id // Their ID
	const guild = client.guilds.cache.get(serverID) // get the guild object
  	const channelTempFull = guild.channels.cache.get(channelVerifyTemp)  // Full information for temp channel		
  	const channelLog = guild.channels.cache.get(channelVerifyLog)  // Full information for temp channel		
	const member = guild.member(user) // Server member info
	const tag = `<@${member.id}>` // Create a tag for them
		if (message.channel.id == channelVerify && message.content == '$verify') { // If in the proper channel and proper message
			message.delete({ timeout: 150 }) // Remove message
			console.log('Gave Temp verified role to ' + user.tag) // Log in the console that we giving them the temp role to them
 			member.roles.add(tempVerifiedRole); // Give them the temp verified role
 			sendMessage(channelTempFull,`${tag} you have 25 seconds to paste a link to your verification here! It will be remove after you post it`, 15) // Send a message in the temp channel
 			sendMessage(channelLog,`${tag} started verification.`, -1) // Send a message in the temp channel
			sleep(60000).then(() => { // wait for 30 seconds
				sendMessage(channelLog,`${tag} lost verified role after timeout.`, -1) // Send a message in the temp channel
				console.log('Removed temp verified role for ' + user.tag)
 				member.roles.remove(tempVerifiedRole); //Remove the temp role if they have waited longer than 30 seconds
			});
		}
		if (message.channel.id == channelVerifyTemp) { //If in the temp channel and not the bot
			var verificationURL = message.content // Save the content of the message
			saveVerification(userid,verificationURL) // Go save this information to google
			message.delete({ timeout: 150 }) //Remove the message
			sendMessage(channelLog,`${tag} lost verified role after sending message.`, -1) // Send a message in the temp channel	
			console.log('Logged verification URL temp verified role for ' + user.tag) // log it
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
 	let userid = user.id, usertag = user.tag; //save who did the mesage
 	let messageid = message.id //ID of message we are reacting to
	const guild = client.guilds.cache.get(serverID) // get the guild object
  	const channelLog = guild.channels.cache.get(channelVerifyLog)  // Full information for temp channel		
  	const tag = `<@${user.id}>` // Create a tag for them
 	if (userid != botID && message.channel.id == channelVerifyAdmin) { // If not the bot
		message.delete({ timeout: 5 }) //Remove the message we reacting to
    	if (emoji.name == '🟢') { //Green Circle
			sendMessage(channelLog,`${tag} Approved Verification.`, -1) // Send a message in the temp channel
			console.log(user.tag + ' Approved Verifcation!'); //Approved verificion
			var status = 'approved' //Set status to approved
   		}
    	if (emoji.name == '🔴') { //Red Circle
    		sendMessage(channelLog,`${tag} Denied Verification.`, -1) // Send a message in the temp channel
			console.log(user.tag + ' Denied Verifcation!'); //Log status
			var status = 'denied' //Set status to denied
   		}
   		console.log(status) // Log if approved or denied
   		readCells(messageid, status) //Run function to log this on google sheets
   	}
});
//Function for saving the information
async function saveVerification(userid,verificationURL) { 
	const guild = client.guilds.cache.get(serverID); // get the guild object
  	const channelFull = guild.channels.cache.get(channelVerifyAdmin); 	//Channel for sending verification log message
  	const channelLog = guild.channels.cache.get(channelVerifyLog);  // Full information for temp channel		
	const tag = `<@${userid}>` //Tag of who submitted it	
	try {
	await doc.useServiceAccountAuth({ //Log into account
    	client_email: creds.client_email,
    	private_key: creds.private_key,
  	});
  	var d = formatted_date(); //Create a date for when this was made
	let sent = await channelFull.send(`${tag} submitted a new verifcation for approval ` + verificationURL) //sending the message and adding reactions
	let verficationID = sent.id; //Getting message ID
	await sent.react('🟢'); //Green
	await sent.react('🔴'); //Red
	await doc.loadInfo(); // loads document properties and worksheets
  	const sheet = doc.sheetsByTitle["Intake"]; // or use doc.sheetsById[id]
  	const arrayRow = await sheet.addRow({ //Add row of information
  		Date: d, //Date
  		Message: verficationID, //Exact message
  		ID: userid, //message logged in all chats
  		URL: verificationURL //URL for verifiction
  	});
  	await sheet.saveUpdatedCells(); //Save this
  	console.log('Verifcation Logged') //Log it
    sendMessage(channelLog,`Logged Verification for ${tag} .`, -1) // Send a message in the temp channel
	} catch (error) {
		console.log(error);
    	console.log("ERROR! Unable to Save Intake"); //Log it if their was error
   		sendMessage(channelLog,`Unable to Save Intake for ${tag} .`, -1) // Send a message in the temp channel
	}
}

async function readCells(messageid,status) {
	try {
	await doc.useServiceAccountAuth({
    	client_email: creds.client_email,
    	private_key: creds.private_key,
  	});
	const guild = client.guilds.cache.get(serverID) // get the guild object
  	const channelLog = guild.channels.cache.get(channelVerifyLog)  // Full information for temp channel		
  	await doc.loadInfo(); // loads document properties and worksheets
  	const sheetIntake = doc.sheetsByTitle["Intake"]; // or use doc.sheetsById[id]
  	const rowsIntake = await sheetIntake.getRows();  //Get the rows of the intake sheet
  	console.log('Read Cells') //Log the status
	var verifiedUserArray = updateArrayID(rowsIntake) //array of users
	var verifiedMessageArray = updateArrayMessage(rowsIntake) //Array of messages
	var verifiedURLArray = updateArrayURL(rowsIntake) //Array of URLs for proof
	const intakePosition = (element) => element == messageid; //Get position in the array of messages matching whichever message we reacted to with a status
	var intakeIndex = verifiedMessageArray.findIndex(intakePosition); //find this element in the verified messages
  	var d = formatted_date() //Date veriable 
  	var userid = verifiedUserArray[intakeIndex]; //User ID in based off of the position of the message array
  	var verificationURL = verifiedURLArray[intakeIndex]; //URL based off the position of the message array
  	const sheetProcessed = doc.sheetsByTitle["Processed"]; // or use doc.sheetsById[id]
  	const arrayRow = await sheetProcessed.addRow({ //Add this row to the processes sheet
  		Date: d, 
  		ID: userid, 
  		URL: verificationURL,
  		Status: status
  	});
  	await sheetProcessed.saveUpdatedCells(); //Save the information
 	rowsIntake[intakeIndex].delete(); //Deleta that row on google sheets
 	const tag = `<@${userid}>` // Create a tag for them  
    sendMessage(channelLog,`Read spreadsheet and removed verification for ${tag}`, -1) // Send a message in the temp channel
 	assignVerified(userid,status) // run the function to assign roles
	} catch (error) { // Error Catching
		console.log(error)
    	console.log("ERROR! Unable to Read Information from Cells")
    	var googleError = error.response.status
    	console.log(googleError)
    	if(googleError == '401' ||googleError == '429' ){ //If for some reason google is rate limiting us
 			const guild = client.guilds.cache.get(serverID);
  			const channelID = channelVerify
  			const channelFull = guild.channels.cache.get(channelID);
  			sendMessage(channelLog,`Error Reading Cells ${googleError}`, -1) // Send a message in the temp channel
  			sendMessage(channelFull, `Google is rate limiting the bot due to spam. Requests will still get processed in the order recieved, information will just not be updated.`, 20)
    		sleep(120000).then(() => {readCells(userid);
    			console.log('Retrying Read Cells')
    		});
    	} else {
    		console.log('ERROR during processing, exiting') //If any other error
    		sendMessage(channelLog,`Error Reading Cells Other Reason`, -1) // Send a message in the temp channel
    	}
	}
}
//Create an array of IDs
function updateArrayID(rows){ 
  	let maxRow = rows.length, dutyArray = [];
	var i;
	for (i = 0; i < maxRow; i++) {
		dutyArray.push(rows[i].ID);
	}
	return dutyArray
}
//Create an array of messageIDs
function updateArrayMessage(rows){
  	let maxRow = rows.length, dutyArray = [];
	var i;
	for (i = 0; i < maxRow; i++) {
		dutyArray.push(rows[i].Message);
	}
	return dutyArray
}
//Create an array of verifications
function updateArrayURL(rows){
  	let maxRow = rows.length, dutyArray = [];
	var i;
	for (i = 0; i < maxRow; i++) {
		dutyArray.push(rows[i].URL);
	}
	return dutyArray
}
//Assign verified status, or let them know it was denied
function assignVerified(userid,status){
 	const guild = client.guilds.cache.get(serverID) // get the guild object
 	const member = guild.members.cache.get(userid) //Memeber who we are selecting
 	const channelID = channelVerify //Main Verification channel ID
  	const channelFull = guild.channels.cache.get(channelID) //Main Verification channel full information
  	const tag = `<@${userid}>` //tag variable who we are tagging to let them know the statuts
	if(status == 'approved'){ //If approved
		member.roles.add('786675086823260160'); //Give the role
		//Send message then nuke after 12 Hours
		sendMessage(channelFull, `${tag} You verification for partner has been approved! Please reivew our rules at <#425748759771873300>`, 43200)
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