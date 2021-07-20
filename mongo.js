const mongoose = require('mongoose')
const { mongoPath } = require('./config.json')

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    keepAlive: 1,
    reconnectTries: 4,
    reconnectInterval: 5000
  })
  return mongoose
}