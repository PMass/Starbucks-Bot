const dbAdd = require('../../dbAdd')
const dsMsg = require('../../dsMsg')
const dbGet = require('../../dbGet')
const dsFunc = require('../../dsFunc')

module.exports = {
  commands: ['verify'],
  callback: async (message, arguments) => {
    const guild = message.guild
    message.delete({ timeout: 100 })
    const channels = await dbGet.channels(guild.id)
    if(message.id == channels.temp){
      console.log('Gave Temp verified role to ' + message.author.tag) // Log in the console that we giving them the temp role to them
      const roles = await dbGet.roles(guild.id)
      dsFunc.giveRole(guild, userID, roles.temp)
      dsMsg.guildMessage(guild, `${tag} you have 25 seconds to paste a link to your verification here! It will be remove after you post it`, "verifyTemp", 30)
      dsMsg.guildMessage(guild, `${tag} started verification`, "log")
      sleep(60).then(() => { // wait for 60 seconds
        dsMsg.guildMessage(guild, `${tag} lost verified role after timeout.`, "log")
        console.log('Removed temp verified role for ' + message.author.tag)
        dsFunc.takeRole(guild, userID, roles.temp)
      });
    }
  },
}

//Cause the process to wait for some time while something is processes
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms*1000));
}