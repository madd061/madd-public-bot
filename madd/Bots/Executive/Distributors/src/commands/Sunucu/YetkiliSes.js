const { PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Formatters } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json");
const ancientcun = require("../../../../src/configs/sunucuayar.json");
const moment = require("moment");
moment.locale("tr");
const { red } = require("../../../../src/configs/emojis.json");
let table = require("string-table");
const ayar = require("../../../../src/configs/ayarName.json");
const allah = require("../../../../../../config.json");

function chunkify(a, n, balanced) {
  if (n < 2) return [a];
  let len = a.length,
      out = [],
      i = 0,
      size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0)
      size--;
    while (i < size * n) {
      out.push(a.slice(i, i += size));
    }
    out.push(a.slice(size * n));
  }
  return out;
}

module.exports = {
  conf: {
    aliases: ["ysay", "yetkilises", "sesteolmayan"],
    name: "ysay",
    help: "ysay",
    category: "yönetim",
  },

  run: async (client, message, args, embed, durum) => {
    let kanallar = ayar.ownerKomutKullanım;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) {
      return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.` }).then((e) => setTimeout(() => { e.delete(); }, 10000));
    }

    if (!message.guild) return;
    if (!conf.sahipRolu.some(ancientcum => message.member.roles.cache.has(ancientcum)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await message.react(`${red}`);
      await message.reply({ content: `Yeterli yetkin yok!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      return;
    }

    var ToplamYetkili = message.guild.members.cache.filter(m => ancientcun.teyitciRolleri.some(x => m.roles.cache.get(x)));
    var AktifOlanYetkili = message.guild.members.cache.filter(m => ancientcun.teyitciRolleri.some(x => m.roles.cache.get(x)) && m.presence && m.presence.status !== 'offline');
    var AktifOlmayanYetkili = message.guild.members.cache.filter(m => ancientcun.teyitciRolleri.some(x => m.roles.cache.get(x)) && m.presence && m.presence.status == 'offline');
    var SesteOlmayanYetkili = message.guild.members.cache.filter(m => ancientcun.teyitciRolleri.some(x => m.roles.cache.get(x)) && !m.voice.channel);
    var SesteOlanYetkili = message.guild.members.cache.filter(m => ancientcun.teyitciRolleri.some(x => m.roles.cache.get(x)) && m.voice.channel);

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('yetkilisay')
          .setPlaceholder(`Menüden bir işlem seçin!`)
          .addOptions([
            { label: 'Yetkilileri listele', value: 'yetkilikontrol', emoji: '📋' },
            { label: 'Yetkilileri sese davet et', value: 'yetkilisesdavet', emoji: '📢' },
            { label: 'Sesteki yetkilileri listele', value: 'sestekiyetkililer', emoji: '🔉' },
            { label: 'Seste olmayan yetkilileri listele', value: 'sesteolmayanyetkililer', emoji: '🔇' },
          ]),
      );

    const hasanınannesi = new EmbedBuilder()
      .setDescription(`
        Yetkili istatistikleri aşağıda verilmiştir. Menüyü kullanarak gerekli işlemleri yerine getirebilirsiniz.
        \`\`\`
        Toplam yetkili        : ${ToplamYetkili.size}
        Çevrimiçi yetkili     : ${AktifOlanYetkili.size}
        Çevrimdışı yetkili    : ${AktifOlmayanYetkili.size}
        Seste olan yetkili    : ${SesteOlanYetkili.size}
        Seste olmayan yetkili : ${SesteOlmayanYetkili.size}
        \`\`\`
      `);

    const ancient = await message.reply({ embeds: [hasanınannesi], components: [row] });
    const filter = i => i.user.id == message.author.id;
    let collector = await ancient.createMessageComponentCollector({ filter, time: 30000 });

    collector.on("collect", async (interaction) => {
      if (interaction.values[0] === "yetkilikontrol") {
        await interaction.deferUpdate();
        var uyeListe = [];
        ToplamYetkili.forEach(member => { uyeListe.push({ memberTag: member.user.tag, online: member.presence ? true : false, voice: member.voice && member.voice.channel ? true : false }) });
        let list = chunkify(uyeListe, 20);
        for (let index = 0; index < list.length; index++) {
          const listeIcerik = list[index];
          await interaction.channel.send({
            content: `${Formatters.codeBlock("md", `${listeIcerik.map(x => `# ${x.memberTag}\n${x.online == true ? `< Çevrimiçi 🟢` : `> Çevrimdışı`}\n${x.voice == true ? `< Seste 🔉` : `> Seste Değil 🔇`}`).join("\n")}`)}`
          });
        }
      }

      if (interaction.values[0] === "yetkilisesdavet") {
        await interaction.deferUpdate();
        if (SesteOlmayanYetkili.size == 0) return interaction.channel.send({ content: "Tüm Yetkililer seste!" });
        var uyeListe = [];
        SesteOlmayanYetkili.forEach(async member => {
          await member.send({ content: `**Heyy ${member.user.tag}**
          \`${message.member.user.tag}\` tarafından **${message.guild.name}** sunucusunda her hangi bir ses kanalına çağrılıyorsun.` }).catch(erro => interaction.channel.send({ content: `**Heyyy ${member}**
          **${message.member.user.tag}** tarafından her hangi bir ses kanalına çağrılıyorsun.` }));
        });
      }

      if (interaction.values[0] === "sestekiyetkililer") {
        await interaction.deferUpdate();
        if (SesteOlanYetkili.size == 0) return interaction.channel.send({ content: `Ses kanallarında yetkili bulunamadı!` });
        var uyeListe = [];
        SesteOlanYetkili.forEach(member => { uyeListe.push({ memberTag: member.user.tag, channel: member.voice.channel.name, memberId: member.id }) });
        let list = chunkify(uyeListe, 20);
        for (let index = 0; index < list.length; index++) {
          const listeIcerik = list[index];
          await interaction.channel.send({
            content: `**Seste olan yetkililer:**\n${Formatters.codeBlock("md", `${listeIcerik.map(x => `# ${x.memberTag}\n< Ses Kanalı: #${x.channel}`).join("\n")}`)}`
          });
        }
      }

      if (interaction.values[0] === "sesteolmayanyetkililer") {
        await interaction.deferUpdate();
        if (SesteOlmayanYetkili.size == 0) return interaction.channel.send({ content: "Garip... tüm yetkililer seste görünüyor! :D" });
        var uyeListe = [];
        SesteOlmayanYetkili.forEach(member => { uyeListe.push({ memberId: member.id }) });
        let list = chunkify(uyeListe, 20);
        for (let index = 0; index < list.length; index++) {
          const listeIcerik = list[index];
          await interaction.channel.send({
            content: `**Seste olmayan yetkililer:**\n${Formatters.codeBlock("md", `${listeIcerik.map(x => `<@${x.memberId}>`).join(", ")}`)}`
          });
        }

        // Yeni eklenen kısım: Seste olmayan yetkililere DM mesajı gönderme
        SesteOlmayanYetkili.forEach(async (member) => {
          await member.send({
            content: `Merhaba ${member.user.tag},\n\nSunucuda şu anda aktif bir toplantı var ve ses kanalına katılmanız bekleniyor. Lütfen toplantıya katılın.`
          }).catch(err => {
            console.log(`Mesaj gönderilemedi: ${err}`);
          });
        });
      }
    });

  },
};
