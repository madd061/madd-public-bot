const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { green, red } = require("../../../../src/configs/emojis.json");
const ayar = require("../../../../src/configs/ayarName.json");
const conf = require("../../../../src/configs/sunucuayar.json");
const allah = require("../../../../../../config.json");

module.exports = {
  conf: {
    aliases: ["unbanunderworld", "kaldırunderworld"],
    name: "unbanunderworld",
    help: "unbanunderworld <ID>",
    category: "cezalandırma",
  },

  run: async (client, message, args) => {
    let kanallar = ayar.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
     if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !conf.banHammer.some(x => message.member.roles.cache.has(x))) 
     {
     message.react(red)
     message.reply({ embeds: [new EmbedBuilder()
       .setThumbnail()
       .setDescription(`${red} Yeterli yetkin bulunmuyor!`)
       ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
     return }
     const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
     if (!member) {
     message.react(red)
     message.reply({ embeds: [new EmbedBuilder()
       .setThumbnail()
       .setDescription(`${red} Bir üye belirtmelisin!`)
       ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
     return }
 
     member.roles.cache.has(conf.boosterRolu) ? member.roles.set([conf.boosterRolu, conf.unregRoles[0]]) : member.roles.set(conf.unregRoles)

// Yeşil emoji ile mesajı yanıtla ve belirli bir süre sonra sil
message.react(green);
message.reply({ 
    content: `${green} ${member.toString()} üyesinin underworld cezası ${message.author} tarafından kaldırıldı!` 
}).then((e) => setTimeout(() => e.delete(), 50000));

// Log mesajını oluştur
const log = new EmbedBuilder()
    .setDescription(`**${member ? member.user.tag : member.user.username}** adlı kullanıcının **${message.author.tag}** tarafından underworld cezası kaldırıldı.`)
    .addFields(
        { name: "Affedilen", value: `[${member ? member.user.tag : member.user.username}](https://discord.com/users/${member.user.id})`, inline: true },
        { name: "Affeden", value: `[${message.author.tag}](https://discord.com/users/${message.author.id})`, inline: true },
        { name: "Ceza Bitiş", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
    )
    .setFooter({ text: `${moment(Date.now()).format("LLL")}` });

// Log mesajını belirtilen kanala gönder
message.guild.channels.cache.get(conf.banLogChannel).send({ embeds: [log] });

   },
 };
 
 