const dbGet = require('./dbGet');
const dsFunc = require('./dsFunc');
const dsMsg = require('./dsMsg');
const verification = require('./verification');

// Function for formatting the single line text that comes from the duty clock
  module.exports.verify = async (message) => {
    try {
      console.log("running Functions-Other Verify()")
      const guild = message.guild // get the guild object
      const roles = await dbGet.roles(guild.id)
      const userID = message.author.id // Their ID      
      verification.save(userID, message.content, guild) // Go save this information to google
      dsFunc.takeRole(guild, userID, roles.temp.id)
      dsMsg.guildMessage(guild, `<@${userID}> lost verified role after sending message.`, "log")
    } catch (error) {
      console.log(error);
    }
  }