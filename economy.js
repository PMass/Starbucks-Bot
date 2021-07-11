const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')

const coinsCache = {} // { 'guildID-userID': coins }

module.exports = (client) => {}

module.exports.addCoins = async (guildID, userID, coins, messages) => {
  return await mongo().then(async (mongoose) => {
    try {
      const result = await userInfoSchema.findOneAndUpdate(
        {
          guildID,
          userID,
        },
        {
          guildID,
          userID,
          $inc: {
            coins,
            messages,
          },
        },
        {
          upsert: true,
          new: true,
        }
      )
      coinsCache[`${guildID}-${userID}`] = result.coins
      return result.coins
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.getCoins = async (guildID, userID) => {
  const cachedValue = coinsCache[`${guildID}-${userID}`]
  if (cachedValue) {
    return cachedValue
  }
  return await mongo().then(async (mongoose) => {
    try {
      const result = await userInfoSchema.findOne({
        guildID,
        userID,
      })
      let coins = 0
      if (result) {
        coins = result.coins
      } else {
        console.log('No user found')
      }
      coinsCache[`${guildID}-${userID}`] = coins
      return coins
    } finally {
      mongoose.connection.close()
    }
  })
}