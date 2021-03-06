const economy = require('../../economy')

module.exports = {
  commands: ['balance', 'bal'],
  maxArgs: 1,
  expectedArgs: "[Target user's @]",
  callback: async (message) => {
    message.delete({ timeout: 5000 })
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const guildID = message.guild.id
    const userID = target.id

    const coins = await economy.getCoins(guildID, userID)

    message.reply(`That user has ${coins} coins!`)
  },
}