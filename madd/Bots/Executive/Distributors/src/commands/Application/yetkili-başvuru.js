const { Discord,ButtonStyle, SlashCommandBuilder, EmbedBuilder, IntegrationApplication, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { basvuru,gorevli,yetkili,green } = require("../../../../src/configs/emojis.json")
let mongoose = require("mongoose");
const allah = require("../../../../../../config.json");
module.exports = {
    conf: {
      aliases: ["basvuru"],
      name: "basvuru",
      help: "basvuru",
      category: "basvuru",
      owner: true,
    },

    run: async (client, message, args) => {

      if (message.guild === null) {
        return message.reply({ content: `Bu komutu sadece Sunucuda kullanabilirsin!`, ephemeral: true })
      } else if (!allah.owners.includes(message.author.id)) {
        return message.reply({ content: "Bot developerı olmadığın için kurulumu yapamazsın.", ephemeral: true })
      } else {
    }
  


    const Four = new ButtonBuilder().setLabel("Yetkili Başvurusu").setCustomId("ybasvuru").setStyle(ButtonStyle.Secondary).setEmoji(basvuru)
    const row = new ActionRowBuilder()
    .addComponents([ Four ,])


await message.channel.send({content: `
NASIL YETKİLİ OLURUM?
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Aşağıdaki butona basarak başvuru formunu doldurmalısınız.

Başvurunuz olumlu değerlendirilirse yetkili alım odanız oluşacak ve değerlendirmeye alınacaksınız.

Eğer başvuruyu gereksiz yere oluşturursanız ceza alabilirsiniz.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
  `,components: [row],
  });
},
};
