const { PermissionsBitField, ButtonStyle, ComponentType, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");
const allah = require("../../../../../../config.json");
const SafeMember = require("../../../../../Protection/src/Models/Koruma");
const SafeMember2 = require("../../../../../Protection/src/Models/Safe")
const { on,of,adminn , green} = require("../../../../src/configs/emojis.json")
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("koruma-aç")
      .setDescription("Sunucu Yetkilerini açıp kapatırsınız."),
      
    async execute(interaction, bot) {
      if(!allah.owners.includes(interaction.user.id)) {
        return interaction.reply({ content: "Yetersiz Yetki.", ephemeral: true })
      } 

      var veri = await SafeMember2.findOne({
        guildID: interaction.guild.id
      }) || {
        "Full": [],
        "RoleAndChannel": [],
        "Role": [],
        "Channel": [],
        "Bot": [],
        "BanAndKick": [],
        "ChatG": [],
        "Permissions": [],
        "SafeRole": []
      };

      const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Sunucu Yetki Aç/Kapatma.')
          .addOptions([
            {
              label: 'Guard Kapat',
              emoji: of,
              description: "Yetkilerİ Geri Kapatırsın",
              value: 'kapat',
            },
            {
              label: 'Guard Aç',
              description: "Yetkilerİ Geri Açarsın.",
              emoji: on,
              value: 'aç',
            },

          ])
      );


const embed = new EmbedBuilder()
.setDescription(`> ${adminn} ${interaction.user.toString()} \`sunucusundaki yetki izin sistemi aç/kapat menü den işlem yapın.\``)
.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp()

    interaction.reply({ embeds: [embed], components: [row] })
      
    const filter = i => i.user.id == interaction.user.id 
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, max: 1, time: 20000 });
    collector.on("collect", async (interaction) => {

         if (interaction.values[0] === "kapat") {
      const perms = [PermissionsBitField.Flags.Administrator, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ManageNicknames, PermissionsBitField.Flags.ManageEmojisAndStickers, PermissionsBitField.Flags.ManageWebhooks];
      let roller = interaction.guild.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))

      const ytembed = new EmbedBuilder()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${interaction.guild.name} sunucusundaki ${roller.map(x => x).join(", ")} rollerinin \`yetki verileri\` kaydedildi ve izinleri kapatıldı`)
      await interaction.update({ embeds: [ytembed], components: [] })
      roller.forEach(async (rol) => {
        await SafeMember.updateOne({ Role: rol.id }, {$set: {"guildID": interaction.guild.id, "Permissions": rol.permissions.bitfield }}, {upsert: true})
        await rol.setPermissions(0n)
      })
  }
        
      if (interaction.values[0] === "aç") {
      let veri = await SafeMember.find({});
      veri.filter(x => interaction.guild.roles.cache.get(x.Role)).forEach(async (data) => {
          let rolgetir = interaction.guild.roles.cache.get(data.Role)
          if(rolgetir) rolgetir.setPermissions(data.Permissions);
      })
      await SafeMember.deleteMany({ guildID: interaction.guild.id });
      const ytembed2 = new EmbedBuilder()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Başarılı bir şekilde koruma kapatıldı ve ${veri.map((x, key) => interaction.guild.roles.cache.get(x.Role)).join(", ")} rollerinin izinleri tekrar açıldı.`)
      await interaction.update({ embeds: [ytembed2], components: [] })
    }

})
collector.on('end', async (collected, reason) => {
  if (reason === 'time') {
    try {
      // Mesajı güncelle ve menüyü kaldır
      await interaction.editReply({ content: 'Zaman aşımı! Seçiminiz kayboldu.', components: [] });

      // Mesajı sil
      await interaction.deleteReply();

      // Kullanıcıya bildirim gönder
      // Bu kısım botun nasıl yapılandırıldığına bağlı olarak değişebilir.
      // Örneğin, bir DM gönderimi yapabilirsiniz veya başka bir bildirim yöntemi kullanabilirsiniz.
      // Aşağıdaki kod örnek olarak bir DM gönderimini göstermektedir.
      const user = await interaction.user.fetch();
      try {
        await user.send('Zaman aşımı nedeniyle seçim süreniz sona erdi.');
      } catch (error) {
        console.error('Kullanıcıya DM gönderilirken bir hata oluştu:', error);
      }
    } catch (error) {
      console.error('Zaman aşımı işlemleri sırasında bir hata oluştu:', error);
    }
  }
});
}
}