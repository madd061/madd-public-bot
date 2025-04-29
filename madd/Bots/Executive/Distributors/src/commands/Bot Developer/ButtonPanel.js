const { ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const messageUser = require("../../../../src/schemas/messageUser");
const voiceUser = require("../../../../src/schemas/voiceUser");
const voiceUserParent = require("../../../../src/schemas/voiceUserParent");
const inviterSchema = require("../../../../src/schemas/inviter");
const inviteMemberSchema = require("../../../../src/schemas/inviteMember");
const nameData = require("../../../../src/schemas/names")
const allah = require("../../../../../../config.json");
const ayarlar = require("../../../../src/configs/sunucuayar.json")
const { hac,green  } = require("../../../../src/configs/emojis.json")
const conf = require("../../../../src/configs/sunucuayar.json")
const moment = require("moment");
moment.locale("tr");
const client = global.bot;

module.exports = {
  conf: {
    aliases: [],
    name: "buttonpanel",
    help: "buttonpanel",
    category: "sahip",
    owner: true,
  },

  run: async (client, message, args) => {
    
    const buttonRow1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('I').setStyle(ButtonStyle.Secondary).setEmoji('1️⃣'),
      new ButtonBuilder().setCustomId('II').setStyle(ButtonStyle.Secondary).setEmoji('2️⃣'),
      new ButtonBuilder().setCustomId('III').setStyle(ButtonStyle.Secondary).setEmoji('3️⃣'),
      new ButtonBuilder().setCustomId('V').setStyle(ButtonStyle.Secondary).setEmoji('4️⃣')
    );

  const buttonRow2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('VI').setStyle(ButtonStyle.Secondary).setEmoji('5️⃣'),
      new ButtonBuilder().setCustomId('VII').setStyle(ButtonStyle.Secondary).setEmoji('6️⃣'),
      new ButtonBuilder().setCustomId('VVVVVVVV').setStyle(ButtonStyle.Secondary).setEmoji('7️⃣'),
      new ButtonBuilder().setCustomId('oneri').setStyle(ButtonStyle.Secondary).setEmoji('8️⃣')
    );

  await message.channel.send({
    embeds: [new EmbedBuilder()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription(`
        **${allah.GuildName}** kullanıcı profili sekmesine hoş geldin!

        1️⃣ \`Sunucuya Giriş Tarihiniz\`

        2️⃣ \`Üzerinde Bulunan Rollerin Listesi\`

        3️⃣ \`Hesap Açılma Tarihiniz\`

        4️⃣ \`Kayıtsıza Gidersiniz\`

        5️⃣ \`Sunucu Verisine Bakarsınız\`

        6️⃣ \`Üyesinin isim bilgileri\`

        7️⃣ \`Boost İsim Degişme\`

        8️⃣ \`İstek Öneri\`

        ${hac} Aşağıdaki butonlara tıklayarak profilin hakkında detaylı bilgi alabilir, sunucu içerisindeki aktivitelerini görebilirsin
      `)
    ],
    components: [buttonRow1, buttonRow2]
  });
}
};

client.on('interactionCreate', async interaction => {
if (interaction.isButton()) {
  const member = interaction.user;

  if (!interaction.guild) {
    return interaction.reply({ content: 'Sunucu bulunamadı.', ephemeral: true });
  }

  if (!interaction.guild.members.cache.has(member.id)) {
    return interaction.reply({ content: 'Kullanıcı sunucuda bulunmuyor.', ephemeral: true });
  }

  if (interaction.customId === 'VVVVVVVV') {
  // Booster rolünü kontrol edin
  const boosterRole = conf.boosterRolu || undefined;
  const memberRoles = interaction.member.roles.cache;

  if (!boosterRole || !memberRoles.has(boosterRole)) {
    return interaction.reply({
      content: 'Bu komutu kullanabilmek için booster rolüne sahip olmalısınız.',
      ephemeral: true
    });
  }

    const modal = new ModalBuilder()
      .setCustomId('nameChangeModal')
      .setTitle('Boost İsim Degişme');

    const nameInput = new TextInputBuilder()
      .setCustomId('newName')
      .setLabel('Yeni isminizi girin:')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(nameInput);
    modal.addComponents(actionRow);

    return interaction.showModal(modal);
  }

  if (interaction.customId === 'I') {
    await interaction.reply({ content: `**Sunucuya Giriş Tarihiniz :** <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}> (<t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R>)`, ephemeral: true });
  }

  if (interaction.customId === 'II') {
    const roles = interaction.guild.members.cache.get(member.id).roles.cache;
    const roleList = roles.filter(a => a.name !== '@everyone').map(a => a.name).join(', ') || 'Hiç yok.';
    await interaction.reply({ content: `**Üzerinde Bulunan Rollerin Listesi ;**\n${roleList}`, ephemeral: true });
  }

  if (interaction.customId === 'III') {
    await interaction.reply({ content: `**Hesabınız** <t:${Math.floor(member.createdTimestamp / 1000)}>  (<t:${Math.floor(member.createdTimestamp / 1000)}:R>) **Tarihinde Açılmış**`, ephemeral: true });
  }

  if (interaction.customId === 'VI') {
    await interaction.reply({ content: `
      **Sesli Kanallardaki Toplam Üye Sayısı :** \`${interaction.guild.members.cache.filter((x) => x.voice.channel).size}\`
      **Sunucudaki Toplam Üye Sayısı :** \`${interaction.guild.memberCount}\`
      **Sunucunun Oluşturulma Tarihi :** \`${moment(interaction.guild.createdAt).locale("tr").format("LLL")}\`
      **Sunucu Destek/Id Numarası :** \`${interaction.guild.id}\`
    `, ephemeral: true });
  }

  if (interaction.customId === 'VII') {
    const data = await nameData.findOne({ guildID: allah.GuildID, userID: member.id });
    const emb = new EmbedBuilder()
      .setAuthor({ name: `${member.username} üyesinin isim bilgileri;` })
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(data ? data.names.splice(0, 10).map((x, i) => `\` ${i + 1} \` \` ${x.name} \` ${x.sebep ? `(${x.sebep})` : ""} ${x.rol ? `(${x.rol})` : ""} ${x.yetkili ? `(<@${x.yetkili}>)` : ""} <t:${Math.floor(x.date / 1000)}:R>`).join("\n") : "Bu kullanıcıya ait isim geçmişi bulunmuyor!");
    await interaction.reply({ embeds: [emb], ephemeral: true });
  }

  if (interaction.customId === 'VIII') {
    const messageData = await messageUser.findOne({ guildID: allah.GuildID, userID: interaction.user.id });
    const voiceData = await voiceUser.findOne({ guildID: allah.GuildID, userID: interaction.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
    const messageDaily = messageData ? messageData.dailyStat : 0;
    const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");
    await interaction.reply({ content: `
      **Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`**
      **Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`**
      **Haftalık Ses: \`${voiceWeekly} ses\`**
      **Günlük Ses: \`${voiceDaily} ses\`**
    `, ephemeral: true });
  }
}

if (interaction.isModalSubmit() && interaction.customId === 'nameChangeModal') {
  const newName = interaction.fields.getTextInputValue('newName');
  const user = interaction.guild ? interaction.guild.members.cache.get(interaction.user.id) : null;

  if (user) {
    try {
      await user.setNickname(newName);
      await interaction.reply({ content: `İsminiz başarıyla \`${newName}\` olarak değiştirildi!`, ephemeral: true });
    } catch (error) {
      console.error('İsim güncelleme hatası:', error);
      await interaction.reply({ content: 'İsminiz güncellenirken bir hata oluştu.', ephemeral: true });
    }
  } else {
    await interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
  }
}
});