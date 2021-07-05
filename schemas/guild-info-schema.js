const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const reqObject = {
  type: Object,
  required: true,
}

const guildInfoSchema = mongoose.Schema({
  guildID: reqString,
  roles: reqObject,
  channels: reqObject,
})

module.exports = mongoose.model('guild-info', guildInfoSchema)