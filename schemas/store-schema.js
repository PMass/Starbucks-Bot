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

const storeSchema = mongoose.Schema({
  guildID: reqString,
  name: reqString,
  cost: reqNum,
  stock: reqNum,
  other: reqObject,
})

module.exports = mongoose.model('store', storeSchema)