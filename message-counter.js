const mongo = require('./mongo');
const economy = require('./economy');
const rank = require('./rank');
const dbGet = require('./dbGet');
const dbAdd = require('./dbAdd');
const dsGet = require('./dsGet');
const dsFunc = require('./dsFunc');

module.exports = (client) => {
  client.on('message', async (message) => {
    const guild = message.guild // get the guild object
    const guildID = guild.id
    if (message.channel.id == 362693647138816003) { //If in the temp channel and not the bot
      const { author } = message
      const userID = author.id
      const coins = 1
      const messages = 1
      const existingUser = await dbGet.userSearch(guildID, userID)
      if(existingUser){
      } else {
        const roles = await dbGet.roles(guildID)
        dsFunc.giveRole(guild, userID, roles.rank1.id)
        // const userRoles = await dsGet.roles(guild, message.member)
        // await dbAdd.user(guildID, userID, userRoles)
      }
      const newCoins = await economy.addCoins(guildID, userID, coins, messages)
      await rank.check(guild, userID)
    }
  })
}