const { PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const giveaway = require('../../../../src/schemas/giveaway.js');
const { cekilis } = require("../../../../src/configs/emojis.json");
const moment = require("moment");
const ms = require("ms");

module.exports = {
  conf: {
    aliases: ["giveaway", "gstart", "ç"],
    name: "çekiliş",
    help: "çekiliş 10m 1 Netflix",
    category: "sahip"
  },

  run: async (client, message, args) => {

    // Yetki kontrolü
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) &&
      !message.member.roles.cache.some(r => r.name === "Sponsor")
    ) {
      return message.reply({ content: `${red} Çekiliş başlatmak için Sponsor ya da Mesaj Yönet yetkisine sahip olmalısın.` });
    }

    // Argümanları kontrol et
    let zaman = args[0];
    let kazanan = args[1];
    let odul = args.slice(2).join(" ");
    let arr = [];

    if (!zaman) return message.reply({ content: `${red} Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Spotify\`` });
    if (!kazanan || isNaN(kazanan) || kazanan < 1) return message.reply({ content: `${red} Lütfen geçerli bir kazanan sayısı girin!` });
    if (!odul) return message.reply({ content: `${red} Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Spotify\`` });

    let sure = ms(zaman);
    if (!sure) return message.reply({ content: `${red} Lütfen geçerli bir süre girin!` });

    let kalan = Date.now() + sure;
    if (message) message.delete();

    // Çekiliş butonu oluşturma
    let xd = new ButtonBuilder()
      .setCustomId("katil")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(cekilis)
      .setLabel('Çekilişe Katıl');

    const row = new ActionRowBuilder().addComponents([xd]);

    let msg = await message.channel.send({
      content: `${cekilis} **ÇEKİLİŞ** ${cekilis}`,
      embeds: [
        new EmbedBuilder()
          .setTitle(`${odul}`)
          .setFooter({ text: `Kazanacak kişi sayısı: ${kazanan} | Bitiş Süresi • ${moment(kalan).format("LLL")}` })
          .setDescription(`
Katılmak için ${cekilis} tıklayın!
Süre: <t:${Math.floor(kalan / 1000)}:R> (<t:${Math.floor(kalan / 1000)}:f>)
Başlatan : ${message.author}
`)
      ], components: [row]
    });

    // Çekiliş süresi bitince kazananları seç
    setTimeout(async () => {
      if (arr.length <= 0) {
        if (msg) msg.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${odul}`)
              .setDescription(`
Çekilişe katılım olmadığından çekiliş iptal edildi!
`)
          ], components: []
        });
        return;
      }

      let kazananlar = [];
      for (let i = 0; i < kazanan; i++) {
        let random = arr[Math.floor(Math.random() * arr.length)];
        if (!kazananlar.includes(random)) kazananlar.push(random);
      }

      message.channel.send({
        content: `${cekilis} Tebrikler ${kazananlar.map(id => `<@${id}>`).join(", ")} kazandınız!`
      });

      if (msg) msg.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${odul}`)
            .setFooter({ text: `Katılımcı Sayısı: ${arr.length}` })
            .setDescription(`
${cekilis} Çekiliş Sonuçlandı!
Çekilişi Başlatan : ${message.author}

Kazanan Katılımcılar : ${kazananlar.map(id => `<@${id}>`).join(", ")}
`)
        ], components: []
      });
    }, sure);

    // Katılımcı toplayıcı
    let collector = await msg.createMessageComponentCollector({});

    collector.on("collect", async (button) => {
      try {
        await button.deferUpdate();

        if (button.customId === "katil") {
          let tikdata = await giveaway.findOne({ messageID: button.message.id });

          if (tikdata?.katilan.includes(button.member.id)) return;

          await giveaway.findOneAndUpdate(
            { messageID: button.message.id },
            { $push: { katilan: button.member.id } },
            { upsert: true }
          );

          arr.push(button.member.id);

          let katilanSayisi = tikdata?.katilan.length + 1 || 1;
          xd.setLabel(`Katılımcı: ${katilanSayisi}`);

          if (msg) msg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle(`${odul}`)
                .setFooter({ text: `Kazanacak kişi sayısı: ${kazanan} | Bitiş Süresi • ${moment(kalan).format("LLL")}` })
                .setDescription(`
Katılmak için ${cekilis} tıklayın!
Süre: <t:${Math.floor(kalan / 1000)}:R> (<t:${Math.floor(kalan / 1000)}:f>)
Başlatan : ${message.author}

Katılımcı Sayısı: ${katilanSayisi}
Son Katılan Üye: ${button.member}
`)
            ], components: [row]
          });
        }
      } catch (error) {
        console.error("Çekiliş buton işlem hatası: ", error);
      }
    });
  },
};
