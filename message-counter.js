const mongo = require('./mongo');
const economy = require('./economy');
const rank = require('./rank');
const dbGet = require('./dbGet');
const dbAdd = require('./dbAdd');
const dsGet = require('./dsGet');
const dsFunc = require('./dsFunc');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.id != 446415191362633769) { // If not Cole
    const guild = message.guild // get the guild object
    const guildID = guild.id
    if (message.channel.id == 362693647138816003) { //If in the temp channel and not the bot
      const { author } = message
      const userID = author.id
      const coins = 1
      const messages = 1
      const newCoins = await economy.addCoins(guildID, userID, coins, messages)
      await rank.check(guild, userID, message)
    }
    }
  })
}