const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const özelPerms = require("../../../../src/schemas/talentPerms");
const { green, red } = require("../../../../src/configs/emojis.json")
const allah = require("../../../../../../config.json");

module.exports = {
  conf: {
    aliases: ["özelkomut"],
    name: "özelkomut",
    help: "özelkomut",
    category: "yönetim",
  },

  run: async (client, message) => {
    if (message.guild === null) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bu komutu sadece Sunucuda kullanabilirsin`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    } else if (!allah.owners.includes(message.author.id)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bot developerı olmadığın için kurulumu yapamazsın`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    }

    // Modal oluştur
    const modal = new ModalBuilder()
      .setCustomId('komut_ekle_modal')
      .setTitle('Komut Ekle')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('komut_ad')
            .setLabel('Komut Adı')
            .setPlaceholder('komut ismi girin (vip,cmd)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('yetkili_rol')
            .setLabel('Yetkili Roller')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('Rol ID’leri (virgül ile ayrılmış)')
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('verilecek_rol')
            .setLabel('Verilecek Roller')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('Rol ID’leri (virgül ile ayrılmış)')
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('kanal')
            .setLabel('Kanal Adı')
            .setPlaceholder('Logun İsmini girin (role_log)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

    // Seçim menüsü oluştur
    const createSelectMenu = (options) => {
      return new StringSelectMenuBuilder()
        .setCustomId('komut_sil_menü')
        .setPlaceholder('Silmek istediğiniz komutu seçin')
        .addOptions(options);
    };

    const createListMenu = (options) => {
      return new StringSelectMenuBuilder()
        .setCustomId('komut_liste_menü')
        .setPlaceholder('Listelemek istediğiniz komutu seçin')
        .addOptions(options);
    };

    let data = await özelPerms.find({ guildID: message.guild.id });
    let options = [];
    let optionValues = new Set();

    data.forEach(d => {
      let value = d.komutAd;
      // Eğer değer zaten mevcutsa, yeni bir değer oluştur
      while (optionValues.has(value)) {
        value = `${d.komutAd}_${Math.floor(Math.random() * 1000)}`;
      }
      optionValues.add(value);

      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(d.komutAd)
          .setValue(value) // Benzersiz bir değer kullanın
      );
    });

    if (options.length === 0) {
      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel('Hiçbir komut bulunamadı')
          .setValue('no_commands')
      );
    }

    // Seçim menüsünü oluştur
    const selectMenu = createSelectMenu(options);
    const listMenu = createListMenu(options);

    // Butonları yan yana hizalamak için tek bir ActionRow kullanın
    const actionRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('open_modal')
          .setLabel('Komut Ekle')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('open_sil_menü')
          .setLabel('Komut Sil')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('open_liste_menü')
          .setLabel('Komut Listele')
          .setStyle(ButtonStyle.Secondary)
      );

    // Kullanıcıya komut ekleme formu ve silme menüsünü gönder
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('Özel Komut Yönetimi')
      .setDescription(`${green} Komut eklemek için formu açabilir, mevcut komutları silmek veya listelemek için menüleri kullanabilirsiniz.`);

    await message.channel.send({ embeds: [embed], components: [actionRow] });

    client.on('interactionCreate', async (interaction) => {
      if (interaction.type === InteractionType.MessageComponent) {
        if (interaction.customId === 'open_modal') {
          await interaction.showModal(modal);
        } else if (interaction.customId === 'open_sil_menü') {
          // Seçim menüsünü göster
          const data = await özelPerms.find({ guildID: message.guild.id });
          let options = [];
          let optionValues = new Set();

          data.forEach(d => {
            let value = d.komutAd;
            while (optionValues.has(value)) {
              value = `${d.komutAd}_${Math.floor(Math.random() * 1000)}`;
            }
            optionValues.add(value);

            options.push(
              new StringSelectMenuOptionBuilder()
                .setLabel(d.komutAd)
                .setValue(value)
            );
          });

          if (options.length === 0) {
            options.push(
              new StringSelectMenuOptionBuilder()
                .setLabel('Hiçbir komut bulunamadı')
                .setValue('no_commands')
            );
          }

          const selectMenu = createSelectMenu(options);
          const row = new ActionRowBuilder().addComponents(selectMenu);

          await interaction.reply({ content: `${green} Lütfen silmek istediğiniz komutu seçin:`, components: [row], ephemeral: true });
        } else if (interaction.customId === 'open_liste_menü') {
          // Listeleme menüsünü göster
          const data = await özelPerms.find({ guildID: message.guild.id });
          let options = [];
          let optionValues = new Set();

          data.forEach(d => {
            let value = d.komutAd;
            while (optionValues.has(value)) {
              value = `${d.komutAd}_${Math.floor(Math.random() * 1000)}`;
            }
            optionValues.add(value);

            options.push(
              new StringSelectMenuOptionBuilder()
                .setLabel(d.komutAd)
                .setValue(value)
            );
          });

          if (options.length === 0) {
            options.push(
              new StringSelectMenuOptionBuilder()
                .setLabel('Hiçbir komut bulunamadı')
                .setValue('no_commands')
            );
          }

          const selectMenu = createListMenu(options);
          const row = new ActionRowBuilder().addComponents(selectMenu);

          await interaction.reply({ content: `${green} Lütfen listelemek istediğiniz komutu seçin:`, components: [row], ephemeral: true });
        } else if (interaction.customId === 'komut_sil_menü') {
          const komutAd = interaction.values[0];
          if (komutAd === 'no_commands') {
            return interaction.reply({ content: `${red} Silinecek komut bulunamadı.`, ephemeral: true });
          }

          await özelPerms.deleteOne({ guildID: message.guild.id, komutAd: komutAd });
          await interaction.reply({ content: `${green} \`${komutAd}\` komutu başarıyla silindi.`, ephemeral: true });
        } else if (interaction.customId === 'komut_liste_menü') {
          const komutAd = interaction.values[0];
          if (komutAd === 'no_commands') {
            return interaction.reply({ content: `${red} Listeleyecek komut bulunamadı.`, ephemeral: true });
          }

          let data2 = await özelPerms.findOne({ guildID: message.guild.id, komutAd: komutAd });
          if (!data2) return interaction.reply({ content: `${red} \`${komutAd}\` isimli bir komut bulunamadı.`, ephemeral: true });

          const yetkiliRoller = data2.YetkiliRol.map(role => role ? `<@&${role}>` : 'Tanımsız').join(', ');
          const verilecekRoller = data2.verilecekRol.map(role => role ? `<@&${role}>` : 'Tanımsız').join(', ');

          const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Komut Detayları')
            .addFields(
              { name: 'Komut Adı', value: data2.komutAd, inline: true },
              { name: 'Yetkili Roller', value: yetkiliRoller, inline: true },
              { name: 'Verilecek Roller', value: verilecekRoller, inline: true },
              { name: 'Kullanım Kanalı', value: data2.kullanımKanal, inline: true }
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } else if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === 'komut_ekle_modal') {
          const komutAd = interaction.fields.getTextInputValue('komut_ad');
          const yetkiliRoller = interaction.fields.getTextInputValue('yetkili_rol').split(',').map(role => role.trim());
          const verilecekRoller = interaction.fields.getTextInputValue('verilecek_rol').split(',').map(role => role.trim());
          const kanal = interaction.fields.getTextInputValue('kanal');

          if (!komutAd || !yetkiliRoller || !verilecekRoller || !kanal) {
            return interaction.reply({ content: `${red} Lütfen tüm alanları doldurduğunuzdan emin olun.`, ephemeral: true });
          }

          // Veritabanına komut ekle
          await özelPerms.findOneAndUpdate(
            { guildID: message.guild.id, komutAd: komutAd },
            { guildID: message.guild.id, komutAd: komutAd, YetkiliRol: yetkiliRoller, verilecekRol: verilecekRoller, kullanımKanal: kanal },
            { upsert: true }
          );

          await interaction.reply({ content: `${green} Komut başarıyla eklendi veya güncellendi.`, ephemeral: true });
        }
      }
    });
  }
};
