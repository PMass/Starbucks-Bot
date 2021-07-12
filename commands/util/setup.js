const dbAdd = require('../../dbAdd')
const dsGet = require('../../dsGet')
const dsMsg = require('../../dsMsg')

module.exports = {
  commands: ['setup'],
  minArgs: 6,
  maxArgs: 6,
  expectedArgs: " <The verification channel> <The temporary verification channel> <The partner hub channel> <The admin approval channel> <The log channel> <The spam channel>",
  permissionError: 'You must be an admin to run this',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    try {
      message.delete({ timeout: 1000 })
      const guild = message.guild
      const roles = await dsGet.rolesGroup(guild)
      const channels = await {};
      channels.verify = message.mentions.channels.array()[0].id
      if (!channels.verify) {
        message.reply('Please tag the channel used for sending the Verify command.');
        return
      }
      channels.temp = message.mentions.channels.array()[1].id;
      if (!channels.temp) {
        message.reply('Please tag the channel used for verification.');
        return
      }
      channels.hub = message.mentions.channels.array()[2].id;
      if (!channels.hub) {
        message.reply('Please tag the channel that is the partner hub');
        return
      }
      channels.admin = message.mentions.channels.array()[3].id;
      if (!channels.admin) {
        message.reply('Please tag the channel that will be viewable by admins only.');
        return
      }
      channels.log = message.mentions.channels.array()[4].id;
      if (!channels.log) {
        message.reply('Please tag the channel that will be used for the log.');
        return
      }
      channels.spam = message.mentions.channels.array()[5].id;
      if (!channels.spam) {
        message.reply('Please tag the channel that will be used for spamming commands.');
        return
      }
      console.log(guild.id, roles, channels);
      await dbAdd.setup(guild.id, roles, channels);
      dsMsg.guildMessage(guild, `Added!`, message.channel.id, 30);
      dsMsg.guildMessage(guild, `You have added this server to the database. Thank you!`, "log");
    } catch(err){
      console.error(err)
    }
  },
}
