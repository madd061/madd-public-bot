const { Discord,ButtonStyle, SlashCommandBuilder, EmbedBuilder, IntegrationApplication, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { info,hac } = require("../../../../src/configs/emojis.json")
let mongoose = require("mongoose");
const allah = require("../../../../../../config.json");
module.exports = {
    conf: {
      aliases: ["yetkili-sponsor"],
      name: "yetkili-sponsor",
      help: "yetkili-sponsor",
      category: "yetkili-sponsor",
      owner: true,
    },

    run: async (client, message, args) => {

      if (message.guild === null) {
        return message.reply({ content: `Bu komutu sadece Sunucuda kullanabilirsin!`, ephemeral: true })
      } else if (!allah.owners.includes(message.author.id)) {
        return message.reply({ content: "Bot developerı olmadığın için kurulumu yapamazsın.", ephemeral: true })
      } else {
    }
  


    const Four = new ButtonBuilder().setLabel("Sponsor Forum").setCustomId("ysponsor").setStyle(3).setEmoji(info)
    const row = new ActionRowBuilder()
    .addComponents([ Four ,])


await message.channel.send({content: `
${hac} **${allah.GuildName}**   **SPONSOR BAŞVURU** ${hac}

Sponsor başvurusu yapmak için aşağıdaki butona tıklayabilirsiniz. Başvurunuzun değerlendirilmesi için lütfen tüm bilgilerinizi doğru ve eksiksiz bir şekilde giriniz. Gereksiz başvuru yapmamanızı rica ediyorum; aksi halde başvurunuz dikkate alınmayabilir veya hesabınıza geçici bir ban uygulanabilir. Lütfen bu süreçte dikkatli olun.

**${allah.GuildName} Yönetim Ekibi**  ||@here@everyone||`,components: [row],
  });
},
};
