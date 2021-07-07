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

const verifcationSchema = mongoose.Schema({
  guildID: reqString,  
  message: reqString,
  userID: reqString,
  time: reqDate,
  url: reqString,
  status: reqString,
})

module.exports = mongoose.model('verifcation', verifcationSchema)