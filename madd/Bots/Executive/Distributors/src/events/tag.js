const conf = require("../../../src/configs/sunucuayar.json")
const { green } = require("../../../src/configs/emojis.json");
const tagSystem = require("../../../src/configs/tagSystem.json")
module.exports = async (message) => {
  if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === ".tag" || message.content.toLowerCase() === "TAG") {
    message.react(green);
    message.reply({ content: `${tagSystem.tags.length > 0 ? `\`\`\`${tagSystem.tags.map(x => `${x}`).join(", ")}\`\`\`` : "\`YOK\`"}`});
  }
};
  
module.exports.conf = {
  name: "messageCreate"
};