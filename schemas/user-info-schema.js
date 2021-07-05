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
  new: reqBoolean,
  rank1: reqBoolean,
  rank2: reqBoolean,
  rank3: reqBoolean,
  rank4: reqBoolean,
})

module.exports = mongoose.model('users-info', userInfoSchema)