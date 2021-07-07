const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')
const guildInfoSchema = require('./schemas/guild-info-schema')
const storeSchema = require('./schemas/store-schema')
const verificationSchema = require('./schemas/verifcation-schema')

// Find all users who are of a current status on the On Duty Database
  module.exports.verification = async (guildID, message) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet verification()')
        const result = await verificationSchema.find(
          {
            guildID,
            message,
          })
        return result
      } finally {
        mongoose.connection.close()
      }
    })
  }
