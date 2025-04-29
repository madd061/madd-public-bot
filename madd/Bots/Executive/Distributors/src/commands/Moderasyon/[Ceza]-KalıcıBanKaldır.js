const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { green, red } = require("../../../../src/configs/emojis.json");
const forceBans = require("../../../../src/schemas/forceBans");
const ayar = require("../../../../src/configs/ayarName.json");
const allah = require("../../../../../../config.json");

module.exports = {
  conf: {
    aliases: ["unforceban", "ufb", "kalıcıbankaldır", "forcebankaldır"],
    name: "unforceban",
    help: "unforceban <ID>",
    category: "cezalandırma",
  },

  run: async (client, message, args, embed) => {

    if (message.guild === null) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bu komutu sadece Sunucuda kullanabilirsin`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    } else if (!allah.owners.includes(message.author.id)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bot developerı olmadığın için kurulumu yapamazsın`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    }


    // Komutun kullanıldığı kanallar kontrolü
    let kanallar = ayar.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) {
      return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.` })
        .then((e) => setTimeout(() => { e.delete(); }, 10000));
    }

    // Kullanıcı ID'si kontrolü
    if (!args[0]) {
      return message.reply({ content: `${red} Bir kullanıcı ID'si girmelisiniz!` })
        .then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    const userID = args[0];

    // Forceban kontrolü
    const ban = await forceBans.findOne({ guildID: message.guild.id, userID });
    if (!ban) {
      return message.reply({ content: `${red} Bu kullanıcı zaten banlı değil!` })
        .then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    // Yasak kaldırma işlemi
    try {
      await message.guild.members.unban(userID);
      await forceBans.findOneAndDelete({ guildID: message.guild.id, userID });

      message.react(green);
      message.reply({ content: `${green} <@${userID}> kullanıcısının kalıcı banı kaldırıldı.` })
        .then((e) => setTimeout(() => { e.delete(); }, 10000));

      // Log kanalına bildirim gönderme
      const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Kalıcı Ban Kaldırıldı")
        .setDescription(`**${userID}** 4kullanıcısının kalıcı banı ${message.author.tag} tarafından kaldırıldı.`)
        .addFields(
          { name: "Kullanıcı", value: `<@${userID}>`, inline: true },
          { name: "Yetkili", value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();

      message.guild.channels.cache.get(ayar.banLogChannel).send({ embeds: [logEmbed] });

    } catch (err) {
      console.error(err);
      message.react(red);
      message.reply({ content: `${red} Kullanıcının banı kaldırılamadı. Bir hata oluştu.` })
        .then((e) => setTimeout(() => { e.delete(); }, 5000));
    }
  },
};
