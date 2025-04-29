const { EmbedBuilder, Events } = require("discord.js");
const client = global.bot;
const conf = require("../../../src/configs/sunucuayar.json");
const allah = require("../../../../../config.json");
const tagSystem = require("../../../src/configs/tagSystem.json");
const { nokta } = require("../../../src/configs/emojis.json");

module.exports = async (oldMember, newMember) => {
  if (oldMember.bot || newMember.bot || oldMember.globalName === newMember.globalName) return;

  const guild = client.guilds.cache.get(allah.GuildID);
  if (!guild) return;

  const member = guild.members.cache.get(oldMember.id);
  if (!member) return;

  const logChannel = client.channels.cache.find((x) => x.name === "family_log");
  const chatChannel = guild.channels.cache.get(conf.chatChannel);

  if (!logChannel || !chatChannel) return;

  const guildTags = Array.isArray(conf.tag) ? conf.tag : tagSystem.tags;
  const hadOldTag = guildTags.some((tag) => oldMember.globalName.includes(tag));
  const hasNewTag = guildTags.some((tag) => newMember.globalName.includes(tag));

  if (hadOldTag && !hasNewTag) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ dynamic: true })
      })
      .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setTitle('Tag Değişikliği Detayları')
      .setDescription(`
       ${nokta} **Üye:** ${member.toString()}
       ${nokta} **ID:** \`${member.id}\`
       ${nokta} **Eski Tag:** ${oldMember.globalName}
       ${nokta} **Yeni Tag:** ${newMember.globalName}
       ${nokta} **Durum:** Tagımızdan ayrıldı.
       ${nokta} **Zaman:** <t:${Math.floor(Date.now() / 1000)}:R>
      `)
      .setColor("Random")
      .setTimestamp();

    logChannel.send({
      content: `${member.toString()} [\`${member.id}\`]`,
      embeds: [embed]
    });

    if (!member.roles.cache.has(conf.vipRole) && !member.roles.cache.has(conf.boosterRolu)) {
      member.roles.set(conf.unregRoles);
    }
  } else if (!hadOldTag && hasNewTag) {
    member.roles.add(conf.ekipRolu);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ dynamic: true })
      })
      .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setTitle('Tag Katılımı Detayları')
      .setDescription(`
      ${nokta} **Üye:** ${member.toString()}
      ${nokta} **ID:** \`${member.id}\`
      ${nokta} **Eski Tag:** ${oldMember.globalName}
      ${nokta} **Yeni Tag:** ${newMember.globalName}
      ${nokta} **Durum:** Tagımızı aldı.
      ${nokta} **Zaman:** <t:${Math.floor(Date.now() / 1000)}:R>
      `)
      .setColor("Random")
      .setTimestamp();

    logChannel.send({
      content: `${member.toString()} [\`${member.id}\`]`,
      embeds: [embed]
    });
  }
};

module.exports.conf = { name: Events.UserUpdate };
