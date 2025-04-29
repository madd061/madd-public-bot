const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js");
const emoji = require("../../../../src/configs/emojis.json")
const { green, red } = require("../../../../src/configs/emojis.json")
const allah = require("../../../../../../config.json");
const ayar = require("../../../../src/configs/ayarName.json");
module.exports = {
  conf: {
    aliases: ["guardpanel", "gpanel"],
    name: "guardpanel",
  },
 
  run: async (client, message, args, embed, prefix) => {
    let kanallar = ayar.ownerkomutkulanım;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
 


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
      } else {
    }

    message.react(green)
let ancient = new EmbedBuilder()
.setDescription(`\`\`\`Guard Yardım Panel \`\`\`
\`.cmd\` **yasakla/banned**
\`.güvenliliste\` **Güvenli Listeye Görürsün**
\`.gkaldır\` **Güvenliden Kaldırısın**
\`.gekle\` **Güvenli Liste Eklersin**
`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })

message.reply({ embeds: [ancient] })

} 
}