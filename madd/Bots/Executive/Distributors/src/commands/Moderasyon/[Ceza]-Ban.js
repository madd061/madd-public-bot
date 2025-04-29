const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const moment = require("moment");
const ceza = require("../../../../src/schemas/ceza");
const cezapuan = require("../../../../src/schemas/cezapuan");
const banLimit = new Map();
moment.locale("tr");
const conf = require("../../../../src/configs/sunucuayar.json");
const allah = require("../../../../../../config.json");
const { red, green, bann } = require("../../../../src/configs/emojis.json");
const ayar = require("../../../../src/configs/ayarName.json");

module.exports = {
  conf: {
    aliases: ["ban", "yargı"],
    name: "ban",
    help: "ban <ancient/ID> <Sebep>",
    category: "cezalandırma",
  },

  run: async (client, message, args, embed) => {
    let kanallar = ayar.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) 
      return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`})
        .then((e) => setTimeout(() => { e.delete(); }, 10000));

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !conf.banHammer.some(x => message.member.roles.cache.has(x))) {
      message.channel.send({ content: "Yeterli yetkin bulunmuyor!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      message.react(red);
      return;
    }

    if (!args[0]) {
      message.reply({ embeds: [new EmbedBuilder().setThumbnail().setDescription(`${red} Bir üye belirtmelisin!`)] })
        .then((e) => setTimeout(() => { e.delete(); }, 5000));
      message.react(red);
      return;
    }

    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) {
      message.reply({ embeds: [new EmbedBuilder().setThumbnail().setDescription(`${red} Böyle bir kullanıcı bulunamadı!`)] })
        .then((e) => setTimeout(() => { e.delete(); }, 5000));
      message.react(red);
      return;
    }

    const member = message.guild.members.cache.get(user.id);
    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    const underworldRole = conf.underworldRole; // "underworld" rol ID'sini sunucuayar.json'a ekleyin.

    if (!underworldRole) return message.channel.send({ content: "Underworld rolü ayarlanmamış!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));

    if (!member) return message.channel.send({ content: "Bu üyeyi bulamıyorum!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));

    if (member.roles.cache.has(underworldRole)) {
      return message.channel.send({ content: "Bu üye zaten 'Underworld' rolüne sahip!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    if (!member.manageable) return message.channel.send({ content: "Bu üyeye rol veremiyorum!" }).then((e) => setTimeout(() => { e.delete(); }, 5000));

    // Üyenin mevcut rollerini kaldır
    const rolesToRemove = member.roles.cache.filter(role => role.id !== underworldRole);
    await member.roles.remove(rolesToRemove, `${reason} | Yetkili: ${message.author.tag}`);

    // "Underworld" rolünü ver
    await member.roles.add(underworldRole, `${reason} | Yetkili: ${message.author.tag}`).catch(() => {});

    message.react(green);

    const ancientbuton = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ancient').setLabel("Underworld Rolü Verildi").setStyle(2).setEmoji(bann).setDisabled(true)
    );

    message.reply({
      content: `${bann} ${member} Üyesine \`${reason}\` Sebebiyle ${message.author} tarafından 'Underworld' rolü verildi.`,
      components: [ancientbuton]
    }).then((e) => setTimeout(() => { e.delete(); }, 50000));

    const log = new EmbedBuilder()
      .setDescription(`**${member.user.tag}** adlı kullanıcıya **${message.author.tag}** tarafından 'Underworld' rolü verildi.`)
      .addFields(
        { name: "Cezalandırılan", value: `[${member.user.tag}](https://discord.com/users/${user.id})`, inline: true },
        { name: "Cezalandıran", value: `[${message.author.tag}](https://discord.com/users/${message.author.id})`, inline: true },
        { name: "Ceza Sebebi", value: `\`\`\`fix\n${reason}\n\`\`\``, inline: false }
      )
      .setFooter({ text: `${moment(Date.now()).format("LLL")}` });
    
    message.guild.channels.cache.get(conf.banLogChannel).send({ embeds: [log] });
  },
};
