

// Function for formatting the single line text that comes from the duty clock
  module.exports.verify = async (message) => {
      const guild = message.guild // get the guild object
      const roles = await dbGet.roles(guild.id)
      const userID = message.author.id // Their ID      
      verification.save(userID, message.content, guild) // Go save this information to google
      dsFunc.takeRole(guild, userID, roles.temp)
      dsMsg.guildMessage(guild, `<@${userID}> lost verified role after sending message.`, "log")
  }