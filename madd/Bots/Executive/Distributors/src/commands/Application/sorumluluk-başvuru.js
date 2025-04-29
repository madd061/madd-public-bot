const { Discord,ButtonStyle, SlashCommandBuilder, EmbedBuilder, IntegrationApplication, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { basvuru,gorevli,yetkili } = require("../../../../src/configs/emojis.json")
let mongoose = require("mongoose");
const allah = require("../../../../../../config.json");
module.exports = {
    conf: {
      aliases: ["sorumluluk-başvuru"],
      name: "sorumluluk-başvuru",
      help: "sorumluluk-başvuru",
      category: "sorumluluk-başvuru",
      owner: true,
    },

    run: async (client, message, args) => {

      if (message.guild === null) {
        return message.reply({ content: `Bu komutu sadece Sunucuda kullanabilirsin!`, ephemeral: true })
      } else if (!allah.owners.includes(message.author.id)) {
        return message.reply({ content: "Bot developerı olmadığın için kurulumu yapamazsın.", ephemeral: true })
      } else {
    }
  


    const Four = new ButtonBuilder().setLabel("Sorumluluk Başvurusu").setCustomId("apply").setStyle(ButtonStyle.Secondary)
    const row = new ActionRowBuilder()
    .addComponents([ Four ,])


await message.channel.send({content: ``,components: [row],
  });
},
};
