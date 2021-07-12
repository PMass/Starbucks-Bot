const economy = require('../../economy')
const dsMsg = require('../../dsMsg')

module.exports = {
  commands: ['store'],
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const guild = message.guild
    message.delete({ timeout: 100 })
    const items = await economy.getAll(guild.id)
    console.log(items)
    await dsMsg.store(message.channel, items, guild)
  },
}