const { ComponentType, SlashCommandBuilder, hyperlink, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const allah = require("../../../../../../config.json");
const { green,adminn,ayarrrr } = require("../../../../src/configs/emojis.json")
const SafeMember = require("../../../../../Protection/src/Models/Safe")
const table = require("table")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("güvenli")
    .setDescription(
      "Güvenli listeye üye kelemenizi sağlar."
    )

    .addUserOption((option) =>
      option.setName("kişi")
        .setDescription("Bir kişi belirtebilirsiniz."),
    )
    .addRoleOption((option) =>
      option.setName("rol")
        .setDescription("Bir rol belirtebilirsiniz.")
    ),
  // ! const member = interaction.options.getMember("kişi");

  async execute(interaction, bot) {
    if(!allah.owners.includes(interaction.user.id)) {
      return interaction.reply({ content: "Yetersiz Yetki.", ephemeral: true })
    }

    var veri = await SafeMember.findOne({
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

    var victim = interaction.options.getMember("kişi") || interaction.options.getRole("rol");

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Güvenli Menü Sistemdesin.')
          .addOptions([
            {
              label: 'Full',
              description: 'Taç Sahibi Seviyesinde olur.',
              emoji: ayarrrr,
              value: 'Full',
            },
            {
              label: 'Rol / Kanal',
              description: 'Sag Tık Yasakla/at erişimi ve yönetimi izin.',
              emoji: ayarrrr,
              value: 'Role&Channel',
            },
            {
              label: 'Rol Yönet',
              description: 'Rollere tam izinli erişimi ve yönetimi izin.',
              emoji: ayarrrr,
              value: 'Role',
            },
            {
              label: 'Kanal Yönet',
              description: 'Kanallara tam izinli erişimi ve yönetimi izin.',
              emoji: ayarrrr,
              value: 'Channel',
            },

            {
              label: 'Ban / Kick',
              description: 'Sag tık Yasakla/At işlemlere tam izin.',
              emoji: ayarrrr,
              value: 'Ban&Kick',
            },

            {
              label: 'Bot Yöneti',
              description: 'Botlara tam izin.',
              emoji: ayarrrr,
              value: 'Bot',
            },
            {
              label: 'Chat Koruma',
              description: 'Chatte reklam/küfür erişimi izini.',
              emoji: ayarrrr,
              value: 'Chat',
            },
            {
              label: 'Sekme Yöneti',
              description: 'Tarayıcı erişimi izini.',
              emoji: ayarrrr,
              value: 'Sekme',
            },
            {
              label: 'Güvenli Rol',
              description: 'Güvenli Rol erişimi izini.',
              emoji: ayarrrr,
              value: 'Saferole',
            },

          ])
      );
    if (victim) {
        const embed = new EmbedBuilder()
        .setDescription(`> ${adminn} ${victim ? `(${victim})` : ""} \`Güvenli listeye eklemek veya çıkarmak için aşağıdaki menüyü kullanınız\``)
.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

.setTimestamp()

    interaction.reply({ embeds: [embed], components: [row] })
    }

    const filter = i => i.user.id == interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, max: 1, time: 10000 });
 collector.on("collect", async (interaction) => {

      if (interaction.values[0] === "Full") {
        if (veri.Full.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { Full: victim.id } }, { upsert: true });
          interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { Full: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Role&Channel") {
        if (veri.RoleAndChannel.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { RoleAndChannel: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { RoleAndChannel: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Role") {
        if (veri.Role.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { Role: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { Role: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Channel") {
        if (veri.Channel.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { Channel: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { Channel: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Ban&Kick") {
        if (veri.BanAndKick.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { BanAndKick: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { BanAndKick: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Bot") {
        if (veri.Bot.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { Bot: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { Bot: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Chat") {
        if (veri.ChatG.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { ChatG: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { ChatG: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Sekme") {
        if (veri.SekmeG.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { SekmeG: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { SekmeG: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }
      if (interaction.values[0] === "Saferole") {
        if (veri.SafeRole.includes(victim.id)) {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { SafeRole: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeden kaldırıldı. (${interaction.values[0]})`, ephemeral: true }).catch({})
        } else {
          await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { SafeRole: victim.id } }, { upsert: true });
          await interaction.reply({ content: `${green} ${victim ? `(${victim})` : ""} başarıyla güvenli listeye eklendi. (${interaction.values[0]})`, ephemeral: true }).catch({})
        }
      }

    });


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