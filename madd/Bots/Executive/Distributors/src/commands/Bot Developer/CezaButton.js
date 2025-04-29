const { Discord, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const allah = require("../../../../../../config.json");
const cezapuan = require("../../../../src/schemas/cezapuan");
const ceza = require("../../../../src/schemas/ceza");
const penals = require("../../../../src/schemas/penals");
const { green, red, ayarrrr, adminn, info } = require("../../../../src/configs/emojis.json");
const moment = require("moment");
moment.locale("tr");
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["cezabuton2"],
    name: "cezabuton2",
    help: "cezabuton2",
    category: "sahip",
    owner: true,
  },

  run: async (client, message, args, embed) => {
    if (message.guild === null) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bu komutu sadece Sunucuda kullanabilirsin`)] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    } else if (!allah.owners.includes(message.author.id)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bot developerı olmadığın için kurulumu yapamazsın`)] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    await message.channel.send({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`> ${ayarrrr} Aşağıda Bulunan Butonlardan \`Ceza Puanınızı\`, \`Aktif Cezalarınızı\` Ve \`Cezanızın Bitmesine Kalan Süreyi Görebilirsiniz*`)],
      components: [{
        type: 1,
        components: [
          { type: 2, style: 2, custom_id: "cezapuan", label: "Ceza Puanı", emoji: { id: "1365776999334805514" } },
          { type: 2, style: 2, custom_id: "cezalarım", label: "Cezalarım", emoji: { id: "1365776969840726038"} },
          { type: 2, style: 2, custom_id: "kalanzaman", label: "Kalan Zamanım?", emoji: { id: "1365776997732843691" } }
        ]
      }]
    });
  },
};

client.on('interactionCreate', async interaction => {
  const member = interaction.user;

  const cezaData = await ceza.findOne({ guildID: allah.GuildID, userID: member.id });
  const cezapuanData = await cezapuan.findOne({ guildID: allah.GuildID, userID: member.id });

  if (interaction.customId === "cezapuan") {
    interaction.reply({
      content: `${member.toString()} Ceza Puanınız : 

 Toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanı\` ve (Toplam **${cezaData ? cezaData.ceza.length : 0}** Ceza) olarak gözükmekte.`, ephemeral: true
    });
  }

  let data = await penals.find({ guildID: allah.GuildID, userID: member.id, active: true }).sort({ date: -1 });
  data = data.map((x) => `\`#${x.id}:\` ${x.active ? "\`Aktif\`" : "\`Pasif\`"} **[${x.type}]** <@${x.staff}>: **${x.reason}** - ${moment(x.date).format("LLL")}`).join("\n");
  if (interaction.customId === "cezalarım") {
    if (data.length === 0) return interaction.reply({ content: `${member.toString()} üyesinin aktif cezası bulunmamaktadır.`, ephemeral: true });
    if (data.length > 0) return interaction.reply({ content: `${data}`, ephemeral: true });
  }

  let datas = await penals.find({ guildID: allah.GuildID, userID: member.id, active: true }).sort({ date: -1 });
  datas = datas.map((x) => `${red} <@${x.staff}> tarafından **${moment(x.date).format("LLL")}**'da işlenen __"#${x.id}"__ numaralı __"${x.type}"__ türündeki cezalandırman <t:${Math.floor(x.finishDate / 1000)}:R> sonlandırılacaktır.`).join("\n");

  if (interaction.customId === "kalanzaman") {
    if (data.length === 0) return interaction.reply({ content: `${member.toString()} üyesinin aktif ceza bilgisi bulunmamakta.`, ephemeral: true })
    await interaction.reply({ content: `${datas}`, ephemeral: true });
  }

});
