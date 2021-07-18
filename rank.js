const Discord = require('discord.js');
const dbGet = require('./dbGet');
const dsGet = require('./dsGet');
const dsFunc = require('./dsFunc');
const dbUpdate = require('./dbUpdate');

// Send message based on channel and a guild
  module.exports.check = async (guild, userID, message) => {
    try {
      const guildID = guild.id
      const [join, messages] = await dbGet.timeAndMessages(guildID, userID)
      const now = new Date().getTime()
      const total = now - join
      const roles = await dbGet.roles(guildID)
      const userRoles = await dsGet.roles(guild, message.member)
      if(total >= 14545200000 && messages >= 340){
      } else if(total >= 14515200000 && messages >= 336 && !(userRoles.includes("4") == true)) {
        dsFunc.giveRole(guild, userID, roles.rank4.id)
        dsFunc.takeRole(guild, userID, roles.rank3.id)
      } else if(total >= 4838400000 && messages >= 112 && !(userRoles.includes("3") == true)) {
        dsFunc.giveRole(guild, userID, roles.rank3.id)
        dsFunc.takeRole(guild, userID, roles.rank2.id)
      } else if(total >= 1209600000 && messages >= 56 && !(userRoles.includes("2") == true)) {
        dsFunc.giveRole(guild, userID, roles.rank2.id)
        dsFunc.takeRole(guild, userID, roles.rank1.id)
      } else {
      }
    } catch(err){
      console.error(err)
    }
  }
