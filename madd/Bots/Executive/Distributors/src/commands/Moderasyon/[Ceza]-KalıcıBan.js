const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const forceBans = require("../../../../src/schemas/forceBans");
const conf = require("../../../../src/configs/sunucuayar.json");
const allah = require("../../../../../../config.json");
const { red, green, bann } = require("../../../../src/configs/emojis.json");
const ayar = require("../../../../src/configs/ayarName.json");

module.exports = {
  conf: {
    aliases: ["forceban", "yargi"],
    name: "forceban",
    help: "forceban <kullanıcı/ID>",
    category: "sahip",
    owner: true
  },

  run: async (client, message, args) => {
    let kanallar = ayar.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) {
      return message.reply({
        content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`).join(", ")} kanallarında kullanabilirsiniz.`
      }).then(e => setTimeout(() => e.delete(), 10000));
    }

    if (!args[0]) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`${red} Bir üye belirtmelisin!`)
        ]
      }).then(e => setTimeout(() => e.delete(), 5000));
    }

    let user;
    try {
      user = message.mentions.users.first() || await client.users.fetch(args[0]);
    } catch (error) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`${red} Böyle bir kullanıcı bulunamadı!`)
        ]
      }).then(e => setTimeout(() => e.delete(), 5000));
    }

    const ban = await forceBans.findOne({ guildID: message.guild.id, userID: user.id });
    if (ban) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`${red} Bu üye zaten banlı!`)
        ]
      }).then(e => setTimeout(() => e.delete(), 5000));
    }

    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);
    if (member && message.member.roles.highest.position <= member.roles.highest.position) {
      return message.reply({
        content: "Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!"
      }).then(e => setTimeout(() => e.delete(), 5000));
    }

    if (member && !member.bannable) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`${red} Bu üyeyi banlayamıyorum!`)
        ]
      }).then(e => setTimeout(() => e.delete(), 5000));
    }

    try {
      await message.guild.members.ban(user.id, { reason });
    } catch (error) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`${red} Kullanıcıyı banlarken bir hata oluştu!`)
        ]
      }).then(e => setTimeout(() => e.delete(), 5000));
    }

    if (allah.Main.dmMessages) {
      user.send(`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından **${reason}** sebebiyle **kalıcı olarak** banlandınız!`).catch(() => {});
    }

    await new forceBans({
      guildID: message.guild.id,
      userID: user.id,
      staff: message.author.id
    }).save();

    const penal = await client.penalize(message.guild.id, user.id, "FORCE-BAN", true, message.author.id, reason);

    message.reply({
      content: `${bann} ${member ? member.toString() : user.username} üyesi ${message.author} tarafından \`${reason}\` nedeniyle **kalıcı olarak** banlandı \`(Ceza ID: #${penal.id})\``
    }).then(e => setTimeout(() => e.delete(), 50000));
    message.react(green);

    const log = new EmbedBuilder()
      .setDescription(`**${member ? member.user.tag : user.username}** adlı kullanıcı **${message.author.tag}** tarafından banlandı.`)
      .addFields(
        { name: "Cezalandırılan", value: `[${member ? member.user.tag : user.username}](https://discord.com/users/${user.id})`, inline: true },
        { name: "Cezalandıran", value: `[${message.author.tag}](https://discord.com/users/${message.author.id})`, inline: true },
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false }
      )
      .setFooter({ text: `${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` });

    message.guild.channels.cache.get(conf.banLogChannel).send({ embeds: [log] });
  },
};
