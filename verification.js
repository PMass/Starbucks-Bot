const dbAdd = require('./dbAdd');
const dbGet = require('./dbGet');
const dbUpdate = require('./dbUpdate');
const dsFunc = require('./dsFunc');
const dsMsg = require('./dsMsg');
const dsGet = require('./dsGet');

//Function for saving the information
  	module.exports.save = async (userID, verificationURL, guild) => {
  		console.log("running verification save()")
		const verify = {}
		try {
			verify.user = userID
			verify.content = verificationURL
			verify.time = formatted_date(); //Create a date for when this was made
			const tag = `<@${userID}>` //Tag of who submitted it
			let sent = await dsMsg.guildMessage(guild, `${tag} submitted a new verifcation for approval ${verificationURL}`, "admin")
			verify.ID = sent.id; //Getting message ID
			await sent.react('🟢'); //Green
			await sent.react('🔴'); //Red
			await dbAdd.verification(guild.id, verify)
			console.log('Verifcation Logged') //Log it
			dsMsg.guildMessage(guild, `Logged Verification for ${tag} `, "log")
		} catch (error) {
			console.log(error);
			console.log("ERROR! Unable to Save Intake"); //Log it if their was error
			dsMsg.guildMessage(guild, `Unable to Save Intake for ${tag}`, "log")
		}
  	}


// Send message based on channel and a guild
  	module.exports.readAndUpdate = async (messageID, status, guild, member) => {
  		console.log("running verification readAndUpdate()")	
		try {
			const guildID = guild.id
			const verify = await dbGet.verification(guildID, messageID)
			console.log(verify.userID)
		   const tag = `<@${verify.userID}>` // Create a tag for them
			var time = formatted_date() //Date veriable 
			await dbUpdate.verification(guildID, messageID, status, time)
			if(status == 'Approved'){ //If approved
				const roles = await dbGet.roles(guildID)
				dsFunc.giveRole(guild, verify.userID, roles.verified.id)
				dsFunc.giveRole(guild, verify.userID, roles.rank1.id)
				dsMsg.guildMessage(guild, `${tag} You verification for partner has been approved! Please reivew our rules at <#425748759771873300>`, "verify", 43200)
				dsMsg.guildMessage(guild, `Please welcome ${tag} to the Partner hub`, "hub", 3600)
	   		const userRoles = await dsGet.roles(guild, member)
				dbAdd.user(guildID, verify.userID, userRoles)
			} else { //If not approved or anything else
				//Send message then nuke after 12 Hours
				dsMsg.guildMessage(guild, `${tag} You verification for partner has been denied. Please review our qualifications before you resubmit!`, "verify", 43200)
			}
		   dsMsg.guildMessage(guild, `Read database and removed verification for ${tag}`, "log")
			} catch (error) { // Error Catching
				console.log(error)
		    	console.log("ERROR! Unable to Read Information from Cells")
		    	dsMsg.guildMessage(guild, `Error Reading Cells Other Reason`, "log")
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
