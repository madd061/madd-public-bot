const { PermissionsBitField, ComponentType, EmbedBuilder, Client, Message, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { red, green, Tac } = require("../../../../src/configs/emojis.json");
let conf = require("../../../../src/configs/yetkili.json");
const ayar = require("../../../../src/configs/sunucuayar.json");
const moment = require("moment");
require("moment-duration-format");
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["yetki-ver", "yetkili-ver", "ytver"],
    name: "yetki-ver",
    help: "yetki-ver",
    category: "yetkili",
  },

  run: async (client, message, args) => {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let kanallar = ayar.KomutKullanımKanalİsim;
    const allowedRoleId = '1365343877116203214'; // Buraya izin verilen rolün ID'sini yazın

    // Kullanıcının belirli role sahip olup olmadığını kontrol et
    if (!message.member.roles.cache.has(allowedRoleId) && !kanallar.includes(message.channel.name)) {
      return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.` }).then((e) => setTimeout(() => { e.delete(); }, 10000));
    }

    if (message.guild === null) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Bu komutu sadece Sunucuda kullanabilirsin`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    } else if (!ayar.yetkilialımRol.includes(message.author.id)) {
      return message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(`${red} Yetkili Alım dan başka kişi kulanamaz`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }
    
    if (!uye) {
      message.react(red)
      message.reply({ embeds: [new EmbedBuilder()
        .setThumbnail()
        .setDescription(`${red} ${red} Kullanıcı etiketleyin veya ID girin.`)
        ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return;
    }

    if (message.author.id === uye.id) return;
    message.reply({ embeds: [new EmbedBuilder()
      .setThumbnail()
      .setDescription(`${red} ${red} Kendine İşlem Yapamasın.`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ytver')
          .setPlaceholder('İlk Staff Yetki Seçiniz')
          .addOptions([
            { label: 'İlk Staff', value: 'staffilk', emoji: Tac },
            { label: 'İkinci Staff', value: 'ikincistaff', emoji: Tac },
            { label: 'Üçüncü Staff', value: 'üçüncüstaff', emoji: Tac },
          ]),
      );

    const ancient = new EmbedBuilder()
      .setDescription(`${message.author}, ${uye} kullanıcısına yetki vermek için aşağıdan bir rol seçin.`)
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setColor("Random");

    let msg = await message.reply({ embeds: [ancient], components: [row] });

    if (msg) {
      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 30000 });

      collector.on("collect", async (interaction) => {
        const selectedValue = interaction.values[0];
        let rolAdi = '';

        if (selectedValue === "staffilk") {
          await uye.roles.add(conf.staffilk);
          rolAdi = "İlk Yönetim";
        } else if (selectedValue === "ikincistaff") {
          await uye.roles.add(conf.ikincistaff);
          await uye.roles.remove(conf.staffilk);
          rolAdi = "Orta Yönetim";
        } else if (selectedValue === "üçüncüstaff") {
          await uye.roles.add(conf.üçüncüstaff);
          await uye.roles.remove(conf.ikincistaff);
        }

        const logEmbed = new EmbedBuilder()
          .setDescription(`${uye} kişisine **${moment(Date.now()).format("LLL")}** tarihinde ${message.author} tarafından \`${rolAdi}\` rolü verildi.`)
          .setColor("Random");

        client.channels.cache.find(x => x.name === "yetkili_log").send({ embeds: [logEmbed] });
        interaction.reply({ content: `${green} ${uye} kullanıcısına \`${rolAdi}\` rolü verildi.`, ephemeral: true });
        
        if (msg) msg.delete();
      });
    }
  }
};
