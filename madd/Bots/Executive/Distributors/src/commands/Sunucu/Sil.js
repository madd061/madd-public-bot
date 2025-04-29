const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["sil"],
    name: "sil",
    help: "sil",
    category: "yetkili",
  },

  run: async (client, message, args) => {
    // Komutun çalışması için gerekli izinlerin kontrolü
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("Bu komutu kullanma izniniz yok.");
    }

    // Mesajları seçmek için bir menü oluşturma
    const messages = await message.channel.messages.fetch({ limit: 10 }); // Son 10 mesajı al
    const options = messages.map(msg => ({
      label: `${msg.author.username} - ${msg.content.slice(0, 50)}`, // Mesajın yazarının adı ve ilk 50 karakteri
      value: msg.id,
    }));

    const menu = new StringSelectMenuBuilder()
      .setCustomId('delete_menu')
      .setPlaceholder('Silmek istediğiniz mesajı seçin veya tümünü silin')
      .addOptions([
        ...options,
        {
          label: 'Tüm Mesajları Sil',
          value: 'delete_all',
        }
      ]);

    // Menü ile bir eylem satırı oluşturma
    const row = new ActionRowBuilder().addComponents(menu);

    // Menü ile bir mesaj gönder
    const menuMessage = await message.reply({ content: 'Silmek istediğiniz mesajı seçin veya tümünü silin:', components: [row] });

    // Seçim yanıtını dinle
    const filter = interaction => interaction.isSelectMenu() && interaction.customId === 'delete_menu';
    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 }); // 30 saniye süre

    collector.on('collect', async (interaction) => {
      const selectedValue = interaction.values[0];

      if (selectedValue === 'delete_all') {
        // Tüm mesajları sil
        try {
          const messagesToDelete = await message.channel.messages.fetch({ limit: 100 }); // Son 100 mesajı al
          await message.channel.bulkDelete(messagesToDelete, true); // Mesajları sil
          await interaction.reply({ content: 'Tüm mesajlar başarıyla silindi.', ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'Mesajlar silinirken bir hata oluştu.', ephemeral: true });
        }
      } else {
        // Seçilen mesajı sil
        try {
          const msg = await message.channel.messages.fetch(selectedValue);
          await msg.delete();
          await interaction.reply({ content: `Mesaj başarıyla silindi: "${msg.content}"`, ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'Mesaj silinirken bir hata oluştu.', ephemeral: true });
        }
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        // Zaman aşımı durumunda menüyü kaldır
        await menuMessage.edit({ content: 'Zaman aşımına uğradı, herhangi bir seçim yapılmadı.', components: [] });
      }
    });
  }
};
