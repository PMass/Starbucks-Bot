const mongo = require('./mongo');
const economy = require('./economy');
const rank = require('./rank');

const talkedRecently = new Set();

module.exports = (client) => {
  client.on('message', async (message) => {
    try{
      if (message.author.id != 446415191362633769) { // If not Cole
        const guild = message.guild // get the guild object
        const guildID = guild.id
        if (message.channel.id == 362693647138816003 || message.channel.id == 648598245924405278 || message.channel.id == 420839863399612417 || message.channel.id == 860249594566803517) { //If in the hub channel
          if (talkedRecently.has(message.author.id)) {
          } else {
          const { author } = message
          const userID = author.id
          await economy.addCoins(guild, userID, 1, 1, message)
          await rank.check(guild, userID, message)
          const time = 300000;
          talkedRecently.add(message.author.id);
          setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
          }, time);
          }
        }
      }
    } catch(err){
      console.error(err)
    }
  })
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
