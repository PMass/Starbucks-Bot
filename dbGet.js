const mongo = require('./mongo')
const userInfoSchema = require('./schemas/user-info-schema')
const guildInfoSchema = require('./schemas/guild-info-schema')
const storeSchema = require('./schemas/store-schema')
const verificationSchema = require('./schemas/verifcation-schema')

const channelsCache = {} // { 'guildID': channels }
const rolesCache = {} // { 'guildID': roles }
const rankCache = {} // { 'guildID-userID': rank }
const joinCache = {} // { 'guildID-userID': joindate }
const userCache = {} // { 'guildID-userID': joindate }

// Find all users who are of a current status on the On Duty Database
  module.exports.verification = async (guildID, message) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet verification()')
        const result = await verificationSchema.findOne(
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

// Find a the guilds discord roles for clocked on and in queue from the Guild database
  module.exports.roles = async (guildID) => {
    const cachedValue = rolesCache[`${guildID}`]
    if (cachedValue) {
      return cachedValue
    }
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet roles()')
        const result = await guildInfoSchema.findOne({
          guildID,
        })
        let roles = {};
        if (result) {
          roles = result.roles
        } else {
          console.log('No User Found')
        }
        rolesCache[`${guildID}`] = roles
        return roles;
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Find the guild channels for the clock, error, log and spam from the Guild database
  module.exports.channels = async (guildID) => {
    const cachedValue = channelsCache[`${guildID}`]
    if (cachedValue) {
      return cachedValue
    }
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet channels()')
        const result = await guildInfoSchema.findOne({
          guildID,     
        })
        let channels = {};
        if (result) {
          channels = result.channels;
        } else {
          console.log('No Server Found');
        }
        channelsCache[`${guildID}`] = channels
        return channels;
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Find the guild channels for the clock, error, log and spam from the Guild database
  module.exports.userTime = async (guildID, userID) => {
    const cachedValue = joinCache[`${guildID}-${userID}`]
    if (cachedValue) {
      return cachedValue
    }
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet userTime()')
        const result = await userInfoSchema.findOne({
          guildID,
          userID,
        })
        if (result) {
          time = result.join;
        } else {
          console.log('No user Found');
        }
        joinCache[`${guildID}-${userID}`] = time
        return time;
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Find the guild channels for the clock, error, log and spam from the Guild database
  module.exports.rank = async (guildID, userID) => {
    const cachedValue = rankCache[`${guildID}-${userID}`]
    if (cachedValue) {
      return cachedValue
    }
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet rank()')
        const result = await userInfoSchema.findOne({
          guildID,
          userID,
        })
        if (result) {
          rank = result.rank;
        } else {
          console.log('No user Found');
        }
        rankCache[`${guildID}-${userID}`] = rank
        return rank;
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Find the guild channels for the clock, error, log and spam from the Guild database
  module.exports.messages = async (guildID, userID) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet messages()')
        const result = await userInfoSchema.findOne({
          guildID,
          userID,
        })
        if (result) {
          messages = result.messages;
        } else {
          console.log('No user Found');
        }
        return messages;
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Find a the guilds discord roles for clocked on and in queue from the Guild database
  module.exports.guildRoles = async (guildID) => {
    return await mongo().then(async (mongoose) => {
      try {
        console.log('Running dbGet guildRoles()')
        const result = await guildInfoSchema.findOne({
          guildID,
        })
        let roles = {};
        if (result) {
          roles = result.roles
        } else {
          console.log('No roles Found')
        }
        return roles;
      } finally {
        mongoose.connection.close()
      }
    })
  }

// Find the guild channels for the clock, error, log and spam from the Guild database
  module.exports.userSearch = async (guildID, userID) => {
    return await mongo().then(async (mongoose) => {
    const cachedValue = userCache[`${guildID}-${userID}`]
    if (cachedValue) {
      return cachedValue
    }
      try {
        console.log('Running dbGet userSearch()')
        const result = await userInfoSchema.findOne({
          guildID,
          userID,
        })
        let found = true
        if (result) {
        } else {
          found = false
        }
        userCache[`${guildID}-${userID}`] = found
        return found;
      } finally {
        mongoose.connection.close()
      }
    })
  }


