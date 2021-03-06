const economy = require('../../economy')

module.exports = {
  commands: ['addbalance', 'addbal'],
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<The target's @> <coin amount>",
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const mention = message.mentions.users.first()

    if (!mention) {
      message.reply('Please tag a user to add coins to.')
      return
    }

    const coins = arguments[1]
    if (isNaN(coins)) {
      message.reply('Please provide a valid numnber of coins.')
      return
    }

    const guildID = message.guild
    const userID = mention.id

    const newCoins = await economy.addCoins(guild, userID, coins, 0, message)

    message.reply(
      `You have given <@${userID}> ${coins} coin(s). They now have ${newCoins} coin(s)!`
    )
  },
}