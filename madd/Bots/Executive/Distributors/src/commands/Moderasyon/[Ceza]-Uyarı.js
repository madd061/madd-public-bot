const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const moment = require("moment");
const ceza = require("../../../../src/schemas/ceza");
moment.locale("tr");
const conf = require("../../../../src/configs/sunucuayar.json");
const allah = require("../../../../../../config.json");
const penals = require("../../../../src/schemas/penals");
const uyarisayi = require("../../../../src/schemas/uyarisayi");
const cezapuan = require("../../../../src/schemas/cezapuan");
const { red, green } = require("../../../../src/configs/emojis.json");
const ayar = require("../../../../src/configs/ayarName.json");

module.exports = {
  conf: {
    aliases: ["uyarı", "warn"],
    name: "uyarı",
    help: "uyarı <ancient/ID> <Sebep>",
    category: "cezalandırma",
  },

  run: async (client, message, args, embed) => {
    // Eğer kullanıcının yetkisi yoksa, işlem durdurulur
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !conf.warnHammer.some(x => message.member.roles.cache.has(x))) {
      message.react(red);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${red} Yeterli yetkin bulunmuyor!`)
        ]
      }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    // Sebep parametresi alınır, eğer yoksa varsayılan değer kullanılır
    const reason = args.slice(1).join(" ") || "Sebep belirtilmedi.";

    // Kullanıcıyı belirleyin
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      message.react(red);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${red} Bu üyeyi susturamıyorum!`)
        ]
      }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    // Ceza işlemleri
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    
    if (conf.cezapuanlog) {
      message.guild.channels.cache.get(conf.cezapuanlog).send({
        content: `${member} üyesi \`uyarı cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`
      });
    }

    // Uyarı sayısı güncelleniyor
    await uyarisayi.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { sayi: 1 } }, { upsert: true });

    // Penal işlemi
    const penal = await client.penalize(message.guild.id, member.user.id, "WARN", false, message.author.id, reason);

    // Ceza işlemi sonrası yanıt
    message.react(green);
    message.reply({
      content: `${green} ${member.toString()} üyesi ${message.author} tarafından \`${reason}\` nedeniyle uyarıldı. Devamında mute veya daha ağır bir ceza alacaksınız \`(Ceza ID: #${penal.id})\``
    }).then((e) => setTimeout(() => { e.delete(); }, 50000));

    // Kullanıcıya DM gönderme
    if (allah.Main.dmMessages) {
      member.send({
        content: `**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle uyarıldınız!`
      }).catch(() => {});
    }

    // Loglama işlemi
    const uyariData = await uyarisayi.findOne({ guildID: message.guild.id, userID: member.user.id });
    const log = new EmbedBuilder()
      .setDescription(`**${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından uyarı verildi.`)
      .addFields(
        { name: "Cezalandırılan", value: `[${member.user.tag}](https://discord.com/users/${member.user.id})`, inline: true },
        { name: "Cezalandıran", value: `[${message.author.tag}](https://discord.com/users/${message.author.id})`, inline: true },
        { name: "Uyarı Sayısı", value: `\`${uyariData ? Math.floor(parseInt(uyariData.sayi)) : 1} Uyarı\``, inline: true },
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false }
      )
      .setFooter({ text: `${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` });

    // Log kanalına gönderim
    message.guild.channels.cache.get(conf.warnLogChannel).send({ embeds: [log] });
  },
};

