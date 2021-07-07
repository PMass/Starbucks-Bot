const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')
const guildInfoSchema = require('./schemas/guild-info-schema')
const storeSchema = require('./schemas/store-schema')
const verificationSchema = require('./schemas/verifcation-schema')

// Add an item to the shop
  module.exports.verification = async (guildID, message, status, time) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbUpdate verification()')
        await verificationSchema.findOneAndUpdate(
          {
            guildID,
            message,
          },
          {
            status,
            time,
          },
          {
            upsert: true,
            new: true,
          }
        )
      } finally {
        mongoose.connection.close()
      }
    })
  }
