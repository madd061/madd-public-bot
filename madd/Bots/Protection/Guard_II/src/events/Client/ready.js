const { EmbedBuilder, ActivityType } = require("discord.js")
const allah = require("../../../../../../config.json");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const client = global.bot;

module.exports = async () => {

  const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

  let guild = client.guilds.cache.get(allah.GuildID);
  
  if (!guild) {
    console.error(`Guild (${allah.GuildID}) bulunamadı!`);
    return;
  }
  
  try {
    await guild.members.fetch();
  } catch (err) {
    console.error("Guild üyeleri çekilirken hata oluştu:", err);
  }

  const connection = getVoiceConnection(allah.GuildID);
  if (!connection) {
    setInterval(async () => {
      const VoiceChannel = client.channels.cache.get(allah.BotSesKanal);
      if (VoiceChannel) {
        joinVoiceChannel({
          channelId: VoiceChannel.id,
          guildId: VoiceChannel.guild.id,
          adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
          selfDeaf: true
        });
      }
    }, 5000);
  }

  let activities = allah.BotDurum, i = 0;
  setInterval(() => client.user.setActivity({ 
    name: `${activities[i++ % activities.length]}`,
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/ancientcik"
  }), 10000);
};

module.exports.conf = {
  name: "ready",
};
