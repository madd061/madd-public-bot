const { EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json")
const { red, green } = require("../../../../src/configs/emojis.json")
const moment = require("moment");
require("moment-duration-format");
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["streamer"],
    name: "streamer",
    help: "streamer"
  },

  run: async (client, message, args) => {
    // Yetki Kontrolü
    if (!hasPermission(message.member)) {
      return message.reply({
        embeds: [createEmbed("Yetki Hatası", `${red} Malesef yetkin bulunmamakta dostum`, "Red", message.member.displayAvatarURL())]
      }).then(msg => setTimeout(() => msg.delete(), 5000));
    }

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) {
      return message.reply({
        embeds: [createEmbed("Kullanıcı Bulunamadı", `Streamer rolü vermek için birini etiketle ve butona bas.`, "Yellow", message.member.displayAvatarURL())]
      }).then(msg => setTimeout(() => msg.delete(), 5000));
    }

    if (message.author.id === uye.id) {
      return message.reply({
        embeds: [createEmbed("Hata", `Kendine rol veremezsin dostum.`, "Red", message.member.displayAvatarURL())]
      }).then(msg => setTimeout(() => msg.delete(), 5000));
    }

    // Streamer Butonu
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("streamer")
        .setLabel("Streamer")
        .setEmoji(green)
        .setStyle(ButtonStyle.Secondary)
    );

    let infoEmbed = createEmbed("Rol İşlemi", `${uye.toString()} isimli kişiye \`Streamer\` rolü vermek için aşağıdaki butona tıklayın.`, "Blue", message.guild.iconURL({ dynamic: true }));

    let msg = await message.channel.send({ embeds: [infoEmbed], components: [row] });
    message.react(green);

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "streamer") {
        await toggleStreamerRole(uye, message, interaction, msg);
      }
    });

    collector.on("end", () => {
      if (msg) msg.delete().catch(() => {});
    });
  }
};

// Yetki Kontrol Fonksiyonu
function hasPermission(member) {
  return (
    conf.rolverici.some(role => member.roles.cache.has(role)) ||
    conf.sahipRolu.some(role => member.roles.cache.has(role)) ||
    member.permissions.has(PermissionsBitField.Flags.Administrator)
  );
}

// Streamer Rolü Ekleme/Kaldırma Fonksiyonu
async function toggleStreamerRole(uye, message, interaction, msg) {
  const streamerRole = conf.streamerRole;
  const hasRole = uye.roles.cache.has(streamerRole);
  const logChannel = client.channels.cache.find(x => x.name === "role_log");

  if (!hasRole) {
    await uye.roles.add(streamerRole);
    logChannel.send({
      embeds: [createEmbed("Streamer Rol Verildi", `${uye} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Streamer** adlı rol verildi.`, "Green")]
    });
    interaction.reply({
      embeds: [createEmbed("Başarılı", `${uye.toString()} isimli kişiye başarıyla **Streamer** rolü verildi.`, "Green")],
      ephemeral: true
    });
  } else {
    await uye.roles.remove(streamerRole);
    logChannel.send({
      embeds: [createEmbed("Streamer Rol Alındı", `${uye} isimli kişiye **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından **Streamer** adlı rol geri alındı.`, "Red")]
    });
    interaction.reply({
      embeds: [createEmbed("Başarılı", `${uye.toString()} isimli kişiden başarıyla **Streamer** rolü geri alındı.`, "Red")],
      ephemeral: true
    });
  }

  if (msg) msg.delete().catch(() => {});
}

// Embed Oluşturma Fonksiyonu
function createEmbed(title, description, color = "Blue", iconURL) {
  const colors = {
    Red: "#FF0000",
    Green: "#00FF00",
    Blue: "#0000FF",
    Yellow: "#FFFF00"
  };

  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(colors[color])
    .setAuthor({ name: title, iconURL: iconURL })
    .setTimestamp();
}
