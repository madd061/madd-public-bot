const allah = require("../../../../../config.json");
const messageUser = require("../../../src/schemas/messageUser");
const sex = require("../../../src/schemas/leaderboard");
const moment = require("moment");
const { EmbedBuilder } = require("discord.js");
const client = global.bot;

module.exports = async () => {
  const messageUsersData = await messageUser.find({ guildID: allah.GuildID }).sort({ topStat: -1 });
  const messageUsers = messageUsersData.splice(0, 10).map((x, index) => `\` ${index+1} \` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
  
  let data = await sex.findOne({ guildID: allah.GuildID });
  if (!data || !data.messageListID.length) return;

  const sunucuisim = client.guilds.cache.get(allah.GuildID).name;
  const channel = client.channels.cache.find(x => x.name === "leaderboard");

  if (!channel) {
    console.error("LeaderBoard kanalı bulunamadı.");
    return;
  }

  try {
    // Mesajı doğrudan çekme ve hata ayıklama
    let LeaderBoard = await channel.messages.fetch(data.messageListID).catch(() => null);

    if (!LeaderBoard) {
      console.error("Mesaj bulunamadı veya ID hatalı. Yeni mesaj oluşturulacak.");
      
      // Mesaj ID'si geçersizse yeni bir mesaj oluştur
      const MessageEdit = new EmbedBuilder()
        .setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({ dynamic: true }) })
        .setDescription(`🎉 Aşağıda \`${sunucuisim}\` sunucusunun genel mesaj sıralamasındaki krallar listelenmektedir.\n\n${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`);

      const newMessage = await channel.send({ embeds: [MessageEdit] });
      data.messageListID = newMessage.id;
      await data.save();
      LeaderBoard = newMessage; // LeaderBoard referansını güncelle
    }

    setInterval(() => {
      ChatLeaderBoard();
    }, 600000);

    function ChatLeaderBoard() {  
      const msgList = `${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`;

      const MessageEdit = new EmbedBuilder()
        .setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({ dynamic: true }) })
        .setDescription(`🎉 Aşağıda \`${sunucuisim}\` sunucusunun genel mesaj sıralamasındaki krallar listelenmektedir.\n\n${msgList}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`);

      LeaderBoard.edit({ embeds: [MessageEdit] });
    }

  } catch (error) {
    console.error("Mesaj getirilemedi veya düzenlenemedi:", error);
  }
};

module.exports.conf = {
  name: "ready",
};
