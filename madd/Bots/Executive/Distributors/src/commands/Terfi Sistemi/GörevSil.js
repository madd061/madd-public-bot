const tasks = require("../../../../src/schemas/task");
const conf = require("../../../../src/configs/sunucuayar.json")
module.exports = {
  conf: {
    aliases: ["görevsil", "görev-sil","goreviptal","gorev-iptal","görev-iptal"],
    name: "görevsil",
    help: "görevsil",
    category: "yetkili"
  },

  run: async (client, message, args, embed) => {
    if(!conf.staffs.some(x => message.member.roles.cache.has(x))) return; 


    const guildID = message.guild.id;
    const userID = message.author.id;

  
    const userTasks = await tasks.find({ guildID: guildID, userID: userID, active: true });

 
    if (userTasks.length === 0) {
      return message.reply("Aktif görev bulunamadı!");
    }

  
    await tasks.deleteMany({ guildID: guildID, userID: userID, active: true });

    message.reply("Tüm aktif görevleriniz başarıyla silindi!");
  }
};
