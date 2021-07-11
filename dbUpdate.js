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

// Add an item to the shop
  module.exports.userTime = async (guildID, userID, time) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbUpdate userTime()')
        await verificationSchema.findOneAndUpdate(
          {
            guildID,
            userID,
          },
          {
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

// Add an item to the shop
  module.exports.rank = async (guildID, userID, rank) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbUpdate rank()')
        await userInfoSchema.findOneAndUpdate(
          {
            guildID,
            userID,
          },
          {
            rank,
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

