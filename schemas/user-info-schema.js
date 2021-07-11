const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}
const reqBoolean = {
  type: Boolean,
  required: true,
}
const reqObject = {
  type: Object,
  required: true,
}
const reqDate = {
  type: Date,
  required: true,
}
const reqNum = {
  type: Number,
  required: true,
}

const userInfoSchema = mongoose.Schema({
  guildID: reqString,  
  userID: reqString,
  roles: reqObject,
  join: reqDate,
  time: reqString,
  messages: reqNum,
  coins: reqNum,
  items: reqObject,
  rank: reqString,
})

module.exports = mongoose.model('user-info', userInfoSchema)