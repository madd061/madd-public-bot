const allah = require("../../../../../config.json");
const voiceUser = require("../../../src/schemas/voiceUser");
const sex = require("../../../src/schemas/leaderboard");
const moment = require("moment");
const { EmbedBuilder } = require("discord.js");
const client = global.bot;

module.exports = async () => {
  const voiceUsersData = await voiceUser.find({ guildID: allah.GuildID }).sort({ topStat: -1 });
  const voiceUsers = voiceUsersData.splice(0, 10).map((x, index) => `\` ${index+1} \` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``).join(`\n`);

  let data = await sex.findOne({ guildID: allah.GuildID });
  if (!data || !data.voiceListID.length) return;

  const sunucuisim = client.guilds.cache.get(allah.GuildID).name;
  const channel = client.channels.cache.find(x => x.name === "leaderboard");

  if (!channel) {
    console.error("LeaderBoard kanalı bulunamadı.");
    return;
  }

  try {
    let LeaderBoard = await channel.messages.fetch(data.voiceListID);

    setInterval(() => {
      checkingLeader();
    }, 600000);

    async function checkingLeader() {  
      const voiceList = (`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`);

      let MessageEdit = new EmbedBuilder()
        .setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({ dynamic: true }) })
        .setDescription(`🎉 Aşağıda \`${sunucuisim}\` sunucusunun genel ses sıralamasındaki krallar listelenmektedir.\n\n${voiceList}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`);

      try {
        await LeaderBoard.edit({ embeds: [MessageEdit] });
      } catch (error) {
        console.error("Mesaj düzenlenemedi:", error);
      }
    }

  } catch (error) {
    console.error("Mesaj getirilemedi veya düzenlenemedi:", error);

    // Eğer mesaj ID'si geçersizse, yeni bir mesaj oluşturup ID'yi güncelleyin
    try {
      const newMessage = await channel.send({ embeds: [new EmbedBuilder().setDescription("🎉 Genel ses sıralaması burada görünecek.")] });
      await sex.updateOne({ guildID: allah.GuildID }, { $set: { voiceListID: newMessage.id } });
    } catch (createError) {
      console.error("Yeni mesaj oluşturulamadı:", createError);
    }
  }
};

module.exports.conf = {
  name: "ready",
};
