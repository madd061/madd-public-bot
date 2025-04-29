const { PermissionsBitField, ButtonStyle, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require('discord.js');
const ayar = require("../../../../src/configs/sunucuayar.json")
const toplams = require("../../../../src/schemas/toplams");
const kayitg = require("../../../../src/schemas/kayitgorev");
const allah = require("../../../../../../config.json");
const { red , green, Kadin, Erkek,Hello,Tac,info } = require("../../../../src/configs/emojis.json")
const isimler = require("../../../../src/schemas/names");
const regstats = require("../../../../src/schemas/registerStats");
const otokayit = require("../../../../src/schemas/otokayit");
const moment = require("moment");
moment.locale("tr")
const client = global.bot;
const emojis = require("../../../../src/configs/emojiName.json")
module.exports = {
  conf: {
    aliases: ["cinsiyet"],
    name: "cinsiyet",
    help: "cinsiyet <ID> <Isim>",
    category: "kayıt",
  },
  
run: async (client, message, args, embed, prefix) => { 

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ayar.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !ayar.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    {
      message.react(message.guild.emojiGöster(emojis.red))
        message.reply({ embeds: [new EmbedBuilder()
      .setThumbnail()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription(`${red} Yeterli yetkin yok!`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    }

    const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("MAN")
      .setLabel("Erkek")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("WOMAN")
      .setLabel("Kadın")
      .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
      .setCustomId("İPTAL")
      .setLabel("İptal")
      .setEmoji(red)
      .setStyle(ButtonStyle.Danger),

  );
  
const row2 = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("MAN")
      .setLabel("Cinsiyet Değiştirildi")
      .setStyle(ButtonStyle.Success)
      .setEmoji(Erkek)
      .setDisabled(true),
  );

const row3 = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("Woman")
      .setLabel("Cinsiyet Değiltirildi")
      .setStyle(ButtonStyle.Success)
      .setEmoji(Kadin)
      .setDisabled(true),
  );

  const row4 = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("iptall")
      .setLabel("İşlem İptal Edildi")
      .setStyle(ButtonStyle.Danger)
      .setEmoji(red)
      .setDisabled(true),
  );


let ancient = new EmbedBuilder()
.setDescription(`${uye.toString()} Cinsiyetini değiştirmek için

aşağıdaki butonlardan yardım alabilirsin erkek/kız olaral değiştire bilirsiniz.
`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })

let msg = await message.channel.send({ embeds: [ancient], components : [row],})
 
 var filter = (button) => button.user.id === message.author.id;
 let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

collector.on("collect", async (button) => {

if(button.customId === "MAN") {
  let ancient = new EmbedBuilder()
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
  .setDescription(`Başarılı bir Şekilde ${uye.toString()} Kişisinin Cinsiyet 
  
  **ERKEK** olarak değiştirildi.`)

    if (msg) msg.delete();
    button.reply({ embeds: [ancient], components: [row2], ephemeral: false });

    await uye.roles.remove(ayar.kizRolleri)
    await uye.roles.add(ayar.erkekRolleri)
    await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: ayar.erkekRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });

  const logEmbed = new EmbedBuilder()
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
  .setDescription(`${uye.toString()} isimli üye ${message.author} yetkili tarafından cinsiyetini **ERKEK** olaral değiştirildi.`)

if (client.channels.cache.find(c => c.name === "register_log")) client.channels.cache.find(c => c.name === "register_log").send({ embeds: [logEmbed] })

}

if(button.customId === "WOMAN") {

  let ancientla = new EmbedBuilder()
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setDescription(`Başarılı bir Şekilde ${uye.toString()} Kişisinin Cinsiyeti 
                    
**KADIN** Olarak Değiştirildi`)

  if (msg) msg.delete();
  button.reply({ embeds: [ancientla], components: [row3], ephemeral: false });

await uye.roles.remove(ayar.erkekRolleri)
await uye.roles.add(ayar.kizRolleri)
await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id,  rol: ayar.kizRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });  

      const logEmbed = new EmbedBuilder()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription(`${uye.toString()} isimli üye ${message.author} yetkili tarafından cinsiyeti **KADIN** olarak değiştirildi.`)

    if (client.channels.cache.find(c => c.name === "register_log")) client.channels.cache.find(c => c.name === "register_log").send({ embeds: [logEmbed] })

  }

if(button.customId === "İPTAL") {
let ancientla = new EmbedBuilder()
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setDescription(`Başarılı bir Şekilde ${uye.toString()} Kişisinin Cinsiyeti 
                      
İşlemi İptal Edildi.`)
  
    if (msg) msg.delete();
    button.reply({ embeds: [ancientla], components: [row4], ephemeral: false });
}

   });
}   
}
