const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')
const guildInfoSchema = require('./schemas/guild-info-schema')

module.exports = (client) => {}

// Add a server to the Guild Database
  module.exports.setup = async (guildID, roles, channels) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbAdd setup()')
        const embeds = {}
        const result = await guildInfoSchema.findOneAndUpdate(
          {
            guildID,
          },
          {
            guildID,
            roles,
            channels,
          },
          {
            upsert: true,
            new: true,
          }
        )
        return
      } finally {
        mongoose.connection.close()
      }
    })
  }
