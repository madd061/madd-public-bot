const { EmbedBuilder, AuditLogEvent, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const allah = require("../../../../../../config.json");
const conf = require("../../../../../Executive/src/configs/sunucuayar.json");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const client = global.bot;
module.exports = async (oldEmoji, newEmoji) => {
let entry = await newEmoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiUpdate }).then(audit => audit.entries.first());
if (!entry || await client.checkPermission(client, entry.executor.id, "full") || await client.checkPermission(client, entry.executor.id, "roleandchannel")) return;

let member = newEmoji.guild.members.cache.get(entry.executor.id); 

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
  .setCustomId("cezaac")
  .setDisabled(conf.jailRole.some(x => member.roles.cache.has(x)) ? true : false)
  .setLabel("Ceza Kaldır").setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
  .setCustomId("yetkileriac")
  .setLabel("Yetki Aç").setStyle(ButtonStyle.Danger)
)

const ancient = new EmbedBuilder()
.setThumbnail(entry.executor.avatarURL({ dynamic: true }))   
.setDescription(`
${entry.executor} üyesi izinsiz emoji güncelledi emojiyi eski haline getirdim \`${moment(Date.now()).format("LLL")}\`

> Yetkili (${entry.executor} - \`${entry.executor.id}\`)
> Emoji \`${newEmoji.name}\` - \`${newEmoji.id}\``)

let ancientGuardLog = await newEmoji.guild.channels.cache.find(x => x.name == "protection_log").send({ embeds: [ancient] });

var filter = (button) => conf.sahipRolu.some(x => x == button.member.roles.cache.has(x)) || allah.owners.includes(button.user.id);
const collector = await ancientGuardLog.createMessageComponentCollector({ filter });

collector.on('collect', async (button) => {
  if (button.customId == "cezaac") {
      member.roles.cache.has(conf.boosterRolu) ? member.roles.set([conf.boosterRolu, conf.unregRoles[0]]) : member.roles.set(conf.unregRoles)
      button.reply({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisinin jailini kaldırdın!`, ephemeral: true })
  }
  if (button.customId == "yetkileriac") {
      client.allPermissionOpen();
      button.reply({ content: `${button.user} Tebrikler! Başarılı bir şekilde sunucudaki rollerin yetkilerini açtın!`, ephemeral: true })
  }
})
};
module.exports.conf = {
  name: "emojiUpdate",
};