const { EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, AttachmentBuilder, Colors, PermissionsBitField } = require('discord.js')
const conf = require("../../../../src/configs/sunucuayar.json");
const ancient = require("../../../../../../config.json");
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["streamerbutton"],
    name: "streamerbutton",
    help: "streamerbutton",
    category: "sahip",
    owner: true,
  },

  run: async (client, message, args) => {
    await message.channel.send({ embeds: [new EmbedBuilder().setThumbnail(message.guild.iconURL({dynamic: true})).setDescription(`
> Merhabalar **${message.guild.name}** Sunucusunun Değerli Üyesi, Streamer Odalarında Yayın Açmak İçin Aşağıda Bulunan Kırmızı Renkteki Butona Basarak Rolünüzü Alabilirsiniz, İyi Eğlenceler Ve İyi Yayınlar Dilerim!`)],"components":[{"type":1,"components":[

        {"type":2,"style":4,"custom_id":"buttonstreamer","label":"Streamer Rolü Almak İçin Tıkla"}
        
        ]}] })
  },
};

client.on('interactionCreate', async interaction => {
  const member = interaction.user;

const etkinlik = await client.guilds.cache.get(ancient.GuildID).roles.cache.find(x => x.name.includes(conf.streamerRole))

    if(interaction.customId === "buttonstreamer")
    {

      if(interaction.guild.members.cache.get(member.id).roles.cache.has(conf.streamerRole)){
          await interaction.guild.members.cache.get(member.id).roles.remove(conf.streamerRole)
          await interaction.reply({ content: `${member.toString()}, başarıyla <@&${conf.streamerRole}> rolünü çıkardınız.`, ephemeral: true });
      } else {
          await interaction.guild.members.cache.get(member.id).roles.add(conf.streamerRole)
          await interaction.reply({ content: `${member.toString()}, başarıyla <@&${conf.streamerRole}> rolü aldınız.`, ephemeral: true });
      }
    }
})