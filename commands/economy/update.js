const economy = require('../../economy')
const dsMsg = require('../../dsMsg')

module.exports = {
  commands: ['update'],
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<the items name> <What you wanted to update  \`cost\` / \`stock\`>",
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const guildID = message.guild.id
    message.delete({ timeout: 100 })
    const name = arguments[0]
    const option = arguments[1]
    var itemInfo = {}
    itemInfo.cost = await economy.getCost(guildID, name)
    itemInfo.stock = await economy.getStock(guildID, name)
    switch (option) {
      case "cost":
        itemInfo.cost = await dsMsg.response(message, `This item currently costs ${itemInfo.cost}. Provide a new cost for this item`);
        await economy.updtItem(guildID, name, itemInfo)
        break;
      case "stock":
        itemInfo.stock = await dsMsg.response(message, `This item currently has ${itemInfo.stock} in stock. Provide a new stock for this item`);
        await economy.updtItem(guildID, name, itemInfo)
        break;
      default:
        message.reply('Please provide a valid option to update.');
    }
    

    message.reply(
      `You have updated ${name} in the database. It now costs ${itemInfo.cost} coin(s) and their is ${itemInfo.stock} of it in stock!`
    )
  },
}