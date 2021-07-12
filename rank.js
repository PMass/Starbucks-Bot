const Discord = require('discord.js');
const dbGet = require('./dbGet');
const dsFunc = require('./dsFunc');
const dbUpdate = require('./dbUpdate');

// Send message based on channel and a guild
  module.exports.check = async (guild, userID) => {
    try {
      const guildID = guild.id
      const join = await dbGet.userTime(guildID, userID)
      const messages = await dbGet.messages(guildID, userID)
      const now = new Date().getTime()
      const total = now - join
      const roles = await dbGet.roles(guildID)
      const rank = await dbGet.rank(guildID, userID)
      if(total >= 14545200000 && messages >= 340){
      } else if(total >= 14515200000 && messages >= 336 && rank != "rank 4") {
        dsFunc.giveRole(guild, userID, roles.rank4.id)
        dsFunc.takeRole(guild, userID, roles.rank3.id)
        dbUpdate.rank(guildID, userID, "rank 4")
      } else if(total >= 4838400000 && messages >= 112 && rank != "rank 3") {
        dsFunc.giveRole(guild, userID, roles.rank3.id)
        dsFunc.takeRole(guild, userID, roles.rank2.id)
        dbUpdate.rank(guildID, userID, "rank 3")
      } else if(total >= 1209600000 && messages >= 56 && rank != "rank 2") {
        dsFunc.giveRole(guild, userID, roles.rank2.id)
        dsFunc.takeRole(guild, userID, roles.rank1.id)
        dbUpdate.rank(guildID, userID, "rank 2")
      } else {
      }
    } catch(err){
      console.error(err)
    }
  }
