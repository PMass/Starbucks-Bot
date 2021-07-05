const Discord = require('discord.js');
const dbGet = require('./dbGet');

// Send message based on channel and a guild
  module.exports.sendGuildMessage = async (guild, text, msgType, duration = -1) => {
    try {
      const channels = await dbGet.guildChannels(guild.id)
      var ch = 0
      switch (msgType) {
        case "log":
          ch = guild.channels.cache.get(channels.log)
          break;
        case "clock":
          ch = guild.channels.cache.get(channels.clock)
          break;
        case "error":
          ch = guild.channels.cache.get(channels.error)
          break;
        case "spam":
          ch = guild.channels.cache.get(channels.spam)
          break;
        default:
          ch = guild.channels.cache.get(msgType)
          console.log("ERROR: No channel specified for Guild Message, using message channel")
      }
      const msg = await ch.send(text)
      if (duration === -1) {
        return
      }
      setTimeout(() => {
        msg.delete()
      }, 1000 * duration)
    } catch(err){
      console.error(err)
    }
  }