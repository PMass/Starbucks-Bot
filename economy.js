const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')
const storeSchema = require('./schemas/store-schema')

const coinsCache = {} // { 'guildID-userID': coins }
const costCache = {} // { 'guildID-name': cost }
const stockCache = {} // { 'guildID-name': stock }

module.exports = (client) => {}

// Adding coins to a user
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

// Getting the users current coins
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

// Adding an item to the Guild
  module.exports.addItem = async (guildID, name, cost, stock) => {
    return await mongo().then(async (mongoose) => {
      const other = {}
      try {
        const result = await storeSchema.findOneAndUpdate(
          {
            guildID,
            name,
          },
          {
            guildID,
            name,
            cost,
            stock,
            other,
          },
          {
            upsert: true,
            new: true,
          }
        )
        costCache[`${guildID}-${name}`] = result.cost
        stockCache[`${guildID}-${name}`] = result.stock
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Getting the users current coins
  module.exports.getCost = async (guildID, name) => {
    const cachedValue = costCache[`${guildID}-${name}`]
    if (cachedValue) {
      return cachedValue
    }
    return await mongo().then(async (mongoose) => {
      try {
        const result = await storeSchema.findOne({
          guildID,
          name,
        })
        let cost = 0
        if (result) {
          cost = result.cost
        } else {
          console.log('No item found')
        }
        costCache[`${guildID}-${name}`] = cost
        return cost
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Getting the users current coins
  module.exports.getStock = async (guildID, name) => {
    const cachedValue = stockCache[`${guildID}-${name}`]
    if (cachedValue) {
      return cachedValue
    }
    return await mongo().then(async (mongoose) => {
      try {
        const result = await storeSchema.findOne({
          guildID,
          name,
        })
        let stock = 0
        if (result) {
          stock = result.stock
        } else {
          console.log('No item found')
        }
        stockCache[`${guildID}-${name}`] = stock
        return stock
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Adding an item to the Guild
  module.exports.updtItem = async (guildID, name, itemInfo) => {
    return await mongo().then(async (mongoose) => {
      try {
        const cost = itemInfo.cost
        const stock = itemInfo.stock
        const result = await storeSchema.findOneAndUpdate(
          {
            guildID,
            name,
          },
          {
            guildID,
            name,
            cost,
            stock,
          },
          {
            upsert: true,
            new: true,
          }
        )
        costCache[`${guildID}-${name}`] = result.cost
        stockCache[`${guildID}-${name}`] = result.stock
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Getting the users current coins
  module.exports.getAll = async (guildID) => {
    return await mongo().then(async (mongoose) => {
      try {
        const result = await storeSchema.find({
          guildID,
        })
        let items = {}
        if (result) {
          items = result
        } else {
          console.log('No item found')
        }
        return items
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Adding an item to the Guild
  module.exports.updtStock = async (guildID, name, stock) => {
    return await mongo().then(async (mongoose) => {
      try {
        const result = await storeSchema.findOneAndUpdate(
          {
            guildID,
            name,
          },
          {
            guildID,
            name,
            stock,
          },
          {
            upsert: true,
            new: true,
          }
        )
        stockCache[`${guildID}-${name}`] = result.stock
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Adding coins to a user
  module.exports.updtBal = async (guildID, userID, coins) => {
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
            coins,
          },
          {
            upsert: true,
            new: true,
          }
        )
        coinsCache[`${guildID}-${userID}`] = result.coins
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Adding coins to a user
  module.exports.getItems = async (guildID, userID) => {
    return await mongo().then(async (mongoose) => {
      try {
        const result = await userInfoSchema.findOne({
          guildID,
          userID,
        })
        let items = {}
        if (result) {
          items = result.items
        } else {
          console.log('No user found')
        }
        return items
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Adding coins to a user
  module.exports.giveItem = async (guildID, userID, items) => {
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
            items,
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

