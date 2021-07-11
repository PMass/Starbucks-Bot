const Discord = require('discord.js');
const dbGet = require('./dbGet');
const dsFunc = require('./dsFunc');

// Send message based on channel and a guild
  module.exports.check = async (guildID, userID) => {
    try {
      const join = await dbGet.userTime(guildID, userID)
      const messages = await dbGet.messages(guildID, userID)
      const now = new Date().getTime()
      const total = now - join
      const roles = await dbGet.roles(guildID)
      const rank = await dbGet.rank(guildID, userID)
      if(total >= 14515200000‬ && messages >= 336 ){
      } else if(total <= 4838400000‬ && messages >= 224) {
        dsFunc.giveRole(guildID, userID, roles.rank4)
        dbUpdate.rank(guildID, userID, "rank 4")
      } else if(total <= 2419200000‬ && messages >= 112) {
        dsFunc.giveRole(guildID, userID, roles.rank3)
        dbUpdate.rank(guildID, userID, "rank 3")
      } else if(total >= 1209600000‬ && messages >= 56 ) {
        dsFunc.giveRole(guildID, userID, roles.rank2)
        dbUpdate.rank(guildID, userID, "rank 2")
      }
    } catch(err){
      console.error(err)
    }
  }
