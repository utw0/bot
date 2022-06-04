const mongoose = require('mongoose');

const xp = mongoose.Schema({
  guildID: String,
  userID: String,
  xp: Number,
  lvl: Number,
  xpToLvl: Number,
  renk: String,
  resim: String,
  saydamlik: String
});

module.exports =  mongoose.model("Xp", xp);