const moment = require("moment");
moment.locale("tr");
const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const snipe = require("../../../src/schemas/snipe");
const conf = require("../../../src/configs/sunucuayar.json");
const client = global.bot || null;

module.exports = async (message) => {
  if (!client) {
    console.error("Client is not defined.");
    return;
  }

  if (message.author.bot) return;

  await snipe.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
  
  const channel = client.channels.cache.find(x => x.name === "message_log");
  if (!channel) {
    console.error("Message log channel not found.");
    return;
  }

  let entry = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(audit => audit.entries.first());
  
  const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`
      ${entry.executor} tarafından ${message.channel} kanalında bir mesaj sildi!
                          
      \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
      \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
      \`•\` Mesaj İçeriği: \`\`\`${message.content.length > 1000 ? "1000 Karakterden uzun.." : `${message.content}`}\`\`\`
      `)
    .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}` });
  
  if (!message.attachments.first()) {
    channel.send({ embeds: [embed] });
  }

  const embedx = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`
      ${entry.executor} tarafından ${message.channel} kanalında bir içerik sildi!
                        
      \`•\` Mesaj Kanalı: ${message.channel} - (\`${message.channel.id}\`)
      \`•\` Mesaj Sahibi: ${message.author} - (\`${message.author.id}\`)
      `)
    .setFooter({ text: `ID: ${message.author.id} • ${moment(Date.now()).format("LLL")}` });
  
  if (message.attachments.first()) {
    channel.send({ embeds: [embedx.setImage(message.attachments.first().proxyURL)] });
  }
};

module.exports.conf = {
  name: "messageDelete",
};
