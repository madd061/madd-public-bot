const { Discord,ButtonStyle, SlashCommandBuilder, EmbedBuilder, IntegrationApplication, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { hac,istatistik } = require("../../../../src/configs/emojis.json")
let mongoose = require("mongoose");
const allah = require("../../../../../../config.json");
module.exports = {
    conf: {
      aliases: ["stream-başvuru"],
      name: "stream-başvuru",
      help: "stream-başvuru",
      category: "stream-başvuru",
      owner: true,
    },

    run: async (client, message, args) => {

      if (message.guild === null) {
        return message.reply({ content: `Bu komutu sadece Sunucuda kullanabilirsin!`, ephemeral: true })
      } else if (!allah.owners.includes(message.author.id)) {
        return message.reply({ content: "Bot developerı olmadığın için kurulumu yapamazsın.", ephemeral: true })
      } else {
    }
  


    const Four = new ButtonBuilder().setLabel("Stream Başvuru").setCustomId("stream başvuru").setStyle(1).setEmoji(istatistik)
    const row = new ActionRowBuilder()
    .addComponents([ Four ,])


await message.channel.send({content: `
${hac} **${allah.GuildName}**   **STREAMER BAŞVURU** ${hac}

Sunucumuzda streamer kategorisinde oda sahibi olabilmeniz için belirli kurallar ve bu kuralların yanı sıra cezaları bulunmaktadır .
Streamer başvurunuz yöneticilerimiz tarafından değerlendirilip ve bununla ilgili size geri dönüş yapılacaktır .
Sunucumuza gösterdiğiniz zaman ve ilgiden dolayı Yönetici ekibi olarak sizlere müteşekkiriz .!

**! SPEED TEST LİNKİNİZİ YOLLAMAYI EKSİK ETMEYİN !**
**Yeni başvuru oluşturmak ve aramıza katılmak için aşağıda bulunan "Streamer Başvuru" butonuna tıklayınız .!**

https://www.speedtest.net/

**${allah.GuildName} Yönetim Ekibi** 
`,components: [row],
  });
},
};
