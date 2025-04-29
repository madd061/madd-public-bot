const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    conf: {
      aliases: ["uptime", "aktiflilik"],
      name: "uptime",
      help: "botsettings",
      category: "sahip",
      owner: true,
    },

    run: async (client, message, args) => {
        message.reply({ content: (`**Bot \`${moment.duration(client.uptime).format('D [gün], H [saat], m [dakika], s [saniye]')}\` süredir açık!**`)});
    },
};