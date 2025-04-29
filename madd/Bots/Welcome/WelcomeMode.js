const { Schema, model } = require("mongoose");

const schema = new Schema({
  guildID: { type: String, default: "1365343876961009806" },
  SesMod: { type: String, default: "Bots/Welcome/src/sesler/hosgeldin.mp3" },
  YetkiliSesMod: { type: String, default: "Bots/Welcome/src/sesler/yetkili.mp3" }
});


module.exports = model("WelcomeMode", schema);