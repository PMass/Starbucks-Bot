const Discord = require('discord.js');
const dbGet = require('./dbGet');

// Send message based on channel and a guild
  module.exports.guildMessage = async (guild, text, msgType, duration = -1) => {
    try {
      const channels = await dbGet.channels(guild.id)
      var ch = 0
      switch (msgType) {
        case "verify":
          ch = guild.channels.cache.get(channels.verify)
          break;
        case "verifyTemp":
          ch = guild.channels.cache.get(channels.temp)
          break;
        case "hub":
          ch = guild.channels.cache.get(channels.hub)
          break;
        case "verifyAdmin":
          ch = guild.channels.cache.get(channels.admin)
          break;
        case "log":
          ch = guild.channels.cache.get(channels.log)
          break;
        default:
          ch = guild.channels.cache.get(msgType)
          console.log("ERROR: No channel specified for Guild Message, using message channel")
      }
      const msg = await ch.send(text)
      if (duration === -1) {
        return msg
      }
      setTimeout(() => {
        msg.delete()
      }, 1000 * duration)
    } catch(err){
      console.error(err)
    }
  }
