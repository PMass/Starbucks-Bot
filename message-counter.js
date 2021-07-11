const mongo = require('./mongo')
const economy = require('./economy')
const messageCountSchema = require('./schemas/message-count-schema')
const rank = require('./rank')

module.exports = (client) => {
  client.on('message', async (message) => {
    const guild = message.guild // get the guild object
    const guildID = guild.id
    const channels = await dbGet.channels(guildID)
    if (message.channel.id == channels.hub) { //If in the temp channel and not the bot
      const { author } = message
      const userID = author.id
      const coins = 1
      const messages = 1
      const existingUser = await dbGet.userSearch(guildID, userID)
      if(existingUser){
      } else {
        const userRoles = await dsGet.getRoles(guildID, userID)
        await dbAdd.user(guildID, userID, userRoles)
      }
      const newCoins = await economy.addCoins(guildID, userID, coins, messages)
      await rank.check(guildID, userID)
    }
  })
}