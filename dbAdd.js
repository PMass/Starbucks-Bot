const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')
const guildInfoSchema = require('./schemas/guild-info-schema')
const storeSchema = require('./schemas/store-schema')
const verificationSchema = require('./schemas/verifcation-schema')

module.exports = (client) => {}

// Add a server to the Guild Database
  module.exports.setup = async (guildID, roles, channels) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbAdd setup()')
        const embeds = {}
        await guildInfoSchema.findOneAndUpdate(
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
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Add an item to the shop
  module.exports.items = async (guildID, name, cost, other) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbAdd items()')
        await storeSchema.findOneAndUpdate(
          {
            guildID,
            name,
          },
          {
            guildID,
            name,
            cost,
            other,
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
  module.exports.user = async (guildID, userInfo, roles) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbAdd user()')
        const userID = userInfo.ID
        const join = userInfo.join
        const time = userInfo.time
        const messages = 0
        const coins = 0
        const items = {}
        const rank1 = true
        const rank2 = false
        const rank3 = false
        const rank4 = false
        await userInfoSchema.findOneAndUpdate(
          {
            guildID,
            userID,
          },
          {
            guildID,
            userID,
            roles,
            join,
            time,
            messages,
            coins,
            items,
            rank1,
            rank2,
            rank3,
            rank4,
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
  module.exports.verification = async (guildID, verify) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbAdd verification()')
        const message = verify.ID
        const userID = verify.user
        const time = verify.time
        const url = verify.content
        const status = "awaiting approval"
        await verificationSchema.findOneAndUpdate(
          {
            guildID,
            message,
          },
          {
            guildID,
            message,
            userID,
            time,
            url,
            status,

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

