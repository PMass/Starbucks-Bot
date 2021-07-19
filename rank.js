const Discord = require('discord.js');
const dbGet = require('./dbGet');
const dsGet = require('./dsGet');
const dsFunc = require('./dsFunc');
const dbUpdate = require('./dbUpdate');

// Send message based on channel and a guild
  module.exports.check = async (guild, userID, message) => {
    try {
      const guildID = guild.id
      const userRoles = await dsGet.roles(guild, message.member)  
      const roles = await dbGet.roles(guildID)      
      if(userRoles.includes(`1`) == true || userRoles.includes(`2`) || userRoles.includes(`3`) || userRoles.includes(`4`)){
        let [total, messages] = await dbGet.timeAndMessages(guildID, userID, userRoles);
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
      } else {      
      dsFunc.giveRole(guild, userID, roles.rank1.id)
      }
    } catch(err){
      console.error(err)
    }
  }
