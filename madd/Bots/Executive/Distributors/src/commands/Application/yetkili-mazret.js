const { Discord,ButtonStyle, SlashCommandBuilder, EmbedBuilder, IntegrationApplication, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { basvuru,gorevli,yetkili,hac } = require("../../../../src/configs/emojis.json")
let mongoose = require("mongoose");
const allah = require("../../../../../../config.json");
module.exports = {
    conf: {
      aliases: ["yetkili-mazeret"],
      name: "yetkili-mazeret",
      help: "yetkili-mazeret",
      category: "yetkili-mazeret",
      owner: true,
    },

    run: async (client, message, args) => {

      if (message.guild === null) {
        return message.reply({ content: `Bu komutu sadece Sunucuda kullanabilirsin!`, ephemeral: true })
      } else if (!allah.owners.includes(message.author.id)) {
        return message.reply({ content: "Bot developerı olmadığın için kurulumu yapamazsın.", ephemeral: true })
      } else {
    }
  


    const Four = new ButtonBuilder().setLabel("Yetkili Mazeret Forum").setCustomId("ymazeret").setStyle(3).setEmoji(gorevli)
    const row = new ActionRowBuilder()
    .addComponents([ Four ,])


await message.channel.send({content: `
${hac} **${allah.GuildName}**   **MAZERET BAŞVURU** ${hac}

> \`Sunucuda Mazeret Formu butona tıklayın ve ordan mazeret forumunu doldurun\`

**${allah.GuildName} Yönetim Ekibi**  ||@here@everyone||`,components: [row],
  });
},
};
