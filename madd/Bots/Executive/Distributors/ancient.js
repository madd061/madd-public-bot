const { Client, Collection, GatewayIntentBits, Partials, InteractionType } = require("discord.js");
const client = global.bot = new Client({ fetchAllMembers: true, intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const discordModals = require('discord-modals');
discordModals(client);
const conf = require("../src/configs/sunucuayar.json");
const fs = require("fs");
const moment = global.moment = require("moment");
client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,EmbedBuilder,ButtonBuilder ,ButtonStyle,StringSelectMenuBuilder,StringSelectMenuOptionBuilder} = require("discord.js")
const { Database } = require("ark.db");
const ancientdb = (global.ancientsetupxd = new Database("../src/configs/sunucuayar.json"));
const emojidb = (global.emojidb = new Database("../src/configs/emojis.json"));
const rankdb = (global.rankdb = new Database("../src/configs/ranks.json"));
client.ranks = rankdb.get("ranks") ? rankdb.get("ranks").sort((a, b) => a.coin - b.coin) : [];
const allah = require("../../../config.json");
const Discord = require("discord.js")
//KOMUT ÇALIŞTIRMA
fs.readdir('./src/Commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[Ancient] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/Commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/Commands/${f}/` + file);
        console.log(`[ancient Commands] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
    console.log(`[Ancient] ${files.length} komut yüklenecek.`);
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(allah.Main.ModerationToken)
  .then(() => console.log("Bot Başarıyla Bağlandı!"))
  .catch(() => console.log("[HATA] Bot Bağlanamadı!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });


  ///// slash commands
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');  
  client.slashcommands = new Collection();
  var slashcommands = [];
  
  fs.readdirSync('./src/Slashcommands/').forEach(async category => {
		const commands = fs.readdirSync(`./src/Slashcommands/${category}/`).filter(cmd => cmd.endsWith('.js'));
		for (const command of commands) {
		const Command = require(`./src/Slashcommands/${category}/${command}`);
    client.slashcommands.set(Command.data.name, Command);
    slashcommands.push(Command.data.toJSON());
		}
	});
  
	const rest = new REST({ version: '10' }).setToken(allah.Main.ModerationToken);
  (async () => {
	try {
		console.log('[Ancient] Slash ve Komutlar yükleniyor.');
		await rest.put(
			Routes.applicationGuildCommands(allah.Main.BotClientID, allah.GuildID),
			{ body: slashcommands },
		).then(() => {
			console.log('[Ancient] Slash ve Context Komutlar yüklendi.');
		});
	}
	catch (e) {
		console.error(e);
	}
})();

client.on('interactionCreate', (interaction) => {
if (interaction.type == InteractionType.ApplicationCommand) {
if(interaction.user.bot) return;
try {
const command = client.slashcommands.get(interaction.commandName)
command.execute(interaction, client)
if (!interaction.inGuild() && interaction.isCommand()) return x.editReply({ content: 'Komutları kullanmak için bir sunucuda olmanız gerekir.' });
if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);
} catch {
interaction.reply({content: "Komut çalıştırılırken bir sorunla karşılaşıldı! Lütfen tekrar deneyin.", ephemeral: true})
}}
});

const bots = global.allbots = [];
let tkn = []

const xd = [
    allah.Main.ModerationToken,
    allah.Main.RegisterToken,
    allah.Main.StatsToken,
    allah.Guard.Token.Guard_I,
    allah.Guard.Token.Guard_II,
    allah.Guard.Token.Guard_III
];
xd.forEach(xxx => 
tkn.push(xxx)
)
allah.Guard.Token.Dağıtıcı.forEach(xx => 
tkn.push(xx)
)
if(allah.Welcome.Active) {
allah.Welcome.Tokens.forEach(x => 
tkn.push(x)
)
}
tkn.forEach(async (token) => {
  const botClient = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent],
      presence: {
          status: "invisible",
          
      },
  });

  botClient.on("ready", async () => {
      bots.push(botClient);
  });

  await botClient.login(token);
});

Discord.Guild.prototype.emojiGöster = function(content) {
  let emoji = client.emojis.cache.find(e => e.name === content) || client.emojis.cache.find(e => e.id === content) || client.emojis.cache.find(e => e.id === content) || client.emojis.cache.find(e => e.name === content)
  if(!emoji) return;
  return emoji;
}

const Seens = require("../src/schemas/seens")

client.on("messageCreate", async (message) => {
  if(message.webhookId || message.author.bot || message.channel.type === "dm" || !message.guild || allah.Main.prefix.some(x => message.content.startsWith(x))) return;
  await Seens.updateOne({userID: message.author.id}, {$set: {
      "lastSeen": Date.now(),
      "lastMessage": Date.now(),
      "last": {
          type: "MESSAGE",
          date: Date.now(),
          channel: message.channel.id,
          text: message.content ? message.content : "İçerik Bulunamadı!",
      }
    }
  }
  )
}
)


let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
global.aylar = aylartoplam;

const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")   
    return tarihci;
};

const kalanzaman = global.kalanzaman = function(tarih) {
    return moment.duration((tarih - Date.now())).format('H [Saat,] m [Dakika,] s [Saniye]');
}

client.emoji = function (emojiName)  {
  const emoji = client.emojis.cache.find(x => x.name.includes(emojiName));
  if (!emoji) return null;
  return emoji;
} 

const chatModel = require("../src/schemas/chatGSchema")
client.on('messageCreate', async (message) => {
    if(!message.guild || message.author.bot || message.author.id === message.guild.ownerId) return;
     const Database = await chatModel.findOne({ ServerID: message.guild.id });
     

if (Database && Database.FiltredWords.some(Word => ` ${message.content.toLowerCase()} `.includes(` ${Word} `)) === true) {
      if (message && message.deletable) message.delete().catch(() => {});
      return message.reply({ embeds: [new EmbedBuilder() 
      .setDescription('<@'+message.author.id+'>, Bu Mesaj Bir Owner Tarafından Yasaklanmıştır.')]}).then(x => setTimeout(async() => { x.delete()}, 3000)).catch(() => {});
     }
 });

const rakam = client.sayıEmoji = (sayi) => {
  var ancientcim = sayi.toString().replace(/ /g, "     ");
  var ancientcim2 = ancientcim.match(/([0-9])/g);
  ancientcim = ancientcim.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
  if (ancientcim2) {
    ancientcim = ancientcim.replace(/([0-9])/g, d => {
      return {
        '0': client.emoji("sifir") !== null ? client.emoji("sifir") : "\` 0 \`",
        '1': client.emoji("bir") !== null ? client.emoji("bir") : "\` 1 \`",
        '2': client.emoji("iki") !== null ? client.emoji("iki") : "\` 2 \`",
        '3': client.emoji("uc") !== null ? client.emoji("uc") : "\` 3 \`",
        '4': client.emoji("dort") !== null ? client.emoji("dort") : "\` 4 \`",
        '5': client.emoji("bes") !== null ? client.emoji("bes") : "\` 5 \`",
        '6': client.emoji("alti") !== null ? client.emoji("alti") : "\` 6 \`",
        '7': client.emoji("yedi") !== null ? client.emoji("yedi") : "\` 7 \`",
        '8': client.emoji("sekiz") !== null ? client.emoji("sekiz") : "\` 8 \`",
        '9': client.emoji("dokuz") !== null ? client.emoji("dokuz") : "\` 9 \`"
      }[d];
    });
  }
  return ancientcim;
}
///////////////////////////////////////////////////////////////////////////////////////////////
const userRoles = require('../src/schemas/SekmeKoruma');
///////////////////////////////////////////////////////////////////////////////////////////////

client.on("presenceUpdate", async (user) => {

if (!user) return;
let permss = allah.Guard.StaffPerm;
const member = client.guilds.cache.get(allah.GuildID).members.cache.get(user.userId)
const ancientcik = `${Object.keys(member.presence.clientStatus)[0]}`;

const perms = ['Administrator','ManageRoles','ManageWebhooks','ManageChannels','ManageGuild','BanMembers','KickMembers','MentionEveryone']; // Add your permissions here
//sekme guard iste amk
const roller = member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && perms.some(perm => e.permissions.has(perm)));
if (!member.user.bot && member.guild.id === allah.GuildID && perms.some(perm => user.member.permissions.has(perm))) {
  if (await client.checkPermission(client, user.userId, "full")) return;
if (ancientcik.includes("web")) {

await userRoles.updateOne({ guildID: allah.GuildID, userID: user.userId }, { $set: { roles: roller.map((e) => e.id) } }, { upsert: true });
await member.roles.remove(roller.map((e) => e.id), "Tarayıcıdan Giriş Yapıldığı İçin Rolleri Alındı.");

let ancient = new EmbedBuilder()
.setDescription(`
> <@${user.userId}> - [\`${user.userId}\`] Web Tarayıcısından Discorda giriş yaptığı için işlem uyğulandı. 

> **Discord Platformuna Sekmeden giriş yaptığı için rolleri alındı**
> **Sekmeden geri çıkınca kullanıcının rolleri verilecektir**

**Rollerin Adı:**
\`\`\`cs\n${roller.map((e) => `${e.name} - ${e.id}`).join("\n")}\n\`\`\``)
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true })})
client.channels.cache.find(x => x.name == "sekme_guard_log").send({ embeds: [ancient] });
}}

if (ancientcik.includes("mobile")) {
const veri = await userRoles.findOne({ guildID: allah.GuildID, userID: user.userId });
if (!veri) return;
if (veri.roles || veri.roles.length) {
await veri.roles.map(e => member.roles.add(e, "Platformunu Değiştirdiği İçin Rolleri Geri Verildi.").then(async () => {
await userRoles.findOneAndDelete({ guildID: allah.GuildID, userID: user.userId });
    
let ancient = new EmbedBuilder()
.setDescription(`
> <@${user.userId}> - [\`${user.userId}\`] Web Tarayıcısından Çıkış Yaptı

> **Platform Değiştiren Kullanıcı İçin Yapılan İşlem: Şüphelinin**
> **Rolleri Geri Verildi!**

**Rollerin Adı:**
\`\`\`cs\n${veri.roles.map((e) => `${client.guilds.cache.get(allah.GuildID).roles.cache.get(e).name} - ${e}`).join("\n")}\n\`\`\``)
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true })})
.setFooter({iconURL: client.guilds.cache.get(allah.GuildID).iconURL({ dynamic: true })})
client.channels.cache.find(x => x.name == "sekme_guard_log").send({ embeds: [ancient] });
    
}).catch(() => {}));
}
}
///////////////////////////////////////////////////////////////////////////////////////////////

if (ancientcik.includes("desktop")) {
const veri = await userRoles.findOne({ guildID: allah.GuildID, userID: user.userId });
if (!veri) return;
if (veri.roles || veri.roles.length) {
await veri.roles.map(e => member.roles.add(e, "Platformunu Değiştirdiği İçin Rolleri Geri Verildi.").then(async () => {
await userRoles.findOneAndDelete({ guildID: allah.GuildID, userID: user.userId });
        
let ancient = new EmbedBuilder()
.setDescription(`
> <@${user.userId}> - [\`${user.userId}\`] Web Tarayıcısından Çıkış Yaptı

> **Platform Değiştiren Kullanıcı İçin Yapılan İşlem: Şüphelinin**
> **Rolleri Geri Verildi!**

**Rollerin Adı:**
\`\`\`cs\n${veri.roles.map((e) => `${client.guilds.cache.get(allah.GuildID).roles.cache.get(e).name} - ${e}`).join("\n")}\n\`\`\``)
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true })})
.setFooter({ text: `Sekme Koruması`, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({ dynamic: true })})
.setTimestamp().setColor(member.displayHexColor)
client.channels.cache.find(x => x.name == "sekme_guard_log").send({ embeds: [ancient] });
        
}).catch(() => {}));
}
} else if (member?.presence?.status === "offline") {
const veri = await userRoles.findOne({ guildID: allah.GuildID, userID: user.userId });
if (!veri) return;
        
let ancient = new EmbedBuilder()
.setDescription(`
> <@${user.userId}> - [\`${user.userId}\`] Web Tarayıcısından Offlineye Geçti

> **Platform Değiştiren Kullanıcı Webden Offlineye Geçtiği için**
> **Rolleri Geri Verilmedi!**
`)
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true })})
client.channels.cache.find(x => x.name == "sekme_guard_log").send({ embeds: [ancient] });
}
});

///////////////////////////////////////////////////////////////////////////////////////////////
client.on("guildMemberOffline", async (member, oldStatus) => {

const perms = ['Administrator','ManageRoles','ManageWebhooks','ManageChannels','ManageGuild','BanMembers','KickMembers','MentionEveryone']; // Add your permissions here
    
const roller = member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && perms.some(perm => e.permissions.has(perm)));
if (!member.user.bot && member.guild.id === allah.GuildID && perms.some(perm => member.permissions.has(perm))) {
if (await checkPermission(client, member.user.id, "full") || await checkPermission(client, member.user.id, "sekmeguard")) return;
       
await userRoles.updateOne({ guildID: allah.GuildID, userID: member.user.id }, { $set: { roles: roller.map((e) => e.id) } }, { upsert: true });
await member.roles.remove(roller.map((e) => e.id), "Offline Moduna Geçildiği İçin Rolleri Alındı.");

if (roller || roller.length) {
let ancient = new EmbedBuilder()
.setDescription(`
> <@${user.userId}> - [\`${user.userId}\`] Web Tarayıcısından Çıkış Yaptı

> **Platform Değiştiren Kullanıcı İçin Yapılan İşlem: Şüphelinin**
> **Rolleri Geri Verildi!**

**Rollerin Adı:**
\`\`\`cs\n${roller.map((e) => `${e.name} - ${e.id}`).join("\n")}\n\`\`\``)
.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
.setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true })})
.setFooter({ iconURL: client.guilds.cache.get(allah.GuildID).iconURL({ dynamic: true })})
.setTimestamp().setColor(member.displayHexColor)
client.channels.cache.find(x => x.name == "sekme_guard_log").send({ embeds: [ancient] });
}}
});
////////////////////////////////////AylikRoller///////////////////////////////////

////////////////////////////////////AylikRoller///////////////////////////////////
client.on(Events.InteractionCreate, async (interaction) => {
  // Button interaction for opening the modal
  if (interaction.isButton() && interaction.customId === 'stream başvuru') {
    const modal = new ModalBuilder()
      .setCustomId('stream başvuru')
      .setTitle('Stream Başvuru Formu');

    // Define input fields
    const nameInput = new TextInputBuilder()
      .setCustomId('nameInput')
      .setLabel('İsim:')
      .setPlaceholder('Örnek: ancient')
      .setStyle(TextInputStyle.Short);

    const ageInput = new TextInputBuilder()
      .setCustomId('ageInput')
      .setLabel('Yaş:')
      .setPlaceholder('Örnek: 20')
      .setStyle(TextInputStyle.Short);

    const streamsInput = new TextInputBuilder()
      .setCustomId('streamsInput')
      .setLabel('Günlük Aktif Yayın Sayısı:')
      .setPlaceholder('Örnek: 3')
      .setStyle(TextInputStyle.Short);

    const platformInput = new TextInputBuilder()
      .setCustomId('platformInput')
      .setLabel('Yayın Platformu:')
      .setPlaceholder('Örnek: Twitch')
      .setStyle(TextInputStyle.Short);

    const speedTestInput = new TextInputBuilder()
      .setCustomId('speedTestInput')
      .setLabel('Speed Test Linki:')
      .setPlaceholder('Hız testi sonuçlarınızı buraya ekleyin.')
      .setStyle(TextInputStyle.Short);

    // Create action rows
    const nameRow = new ActionRowBuilder().addComponents(nameInput);
    const ageRow = new ActionRowBuilder().addComponents(ageInput);
    const streamsRow = new ActionRowBuilder().addComponents(streamsInput);
    const platformRow = new ActionRowBuilder().addComponents(platformInput);
    const speedTestRow = new ActionRowBuilder().addComponents(speedTestInput);

    // Add action rows to the modal
    modal.addComponents(nameRow, ageRow, streamsRow, platformRow, speedTestRow);

    await interaction.showModal(modal);
  }

  // Handle modal submission
  if (interaction.isModalSubmit() && interaction.customId === 'stream başvuru') {
    const name = interaction.fields.getTextInputValue('nameInput');
    const age = interaction.fields.getTextInputValue('ageInput');
    const streamsPerDay = interaction.fields.getTextInputValue('streamsInput');
    const platform = interaction.fields.getTextInputValue('platformInput');
    const speedTestLink = interaction.fields.getTextInputValue('speedTestInput');

    await interaction.reply({ content: 'Başvurunuz başarıyla iletildi.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setDescription(`Hey ${interaction.member} adlı üye yeni bir başvuru yaptı.\n`)
      .addFields([
        { name: 'Üye Bilgileri', value: `${interaction.member} - (\`${interaction.member.id}\`)` },
        { name: 'İsim', value: name },
        { name: 'Yaş', value: age },
        { name: 'Günlük Aktif Yayın Sayısı', value: streamsPerDay },
        { name: 'Yayın Platformu', value: platform },
        { name: 'Speed Test Linki', value: speedTestLink },
      ]);

    const logChannel = client.channels.cache.find(channel => channel.name === "stream_başvuru_log");
    if (logChannel) {
      logChannel.send({ embeds: [embed] });
    } else {
      console.error('Log channel not found.');
    }
  }
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on(Events.InteractionCreate, async (interaction) => {

if (interaction.customId === 'oneri') {
  
  const modal = new ModalBuilder()
  .setCustomId("onerilet")
  .setTitle("İstek Öneri")
  const sorunnee = new TextInputBuilder()
  .setCustomId("sorunnee")
  .setMinLength(10)
  .setLabel(`İstek Öneri İlete Bilirsin`)
  .setPlaceholder("Örn: Sunucunun Banneri değişin")
  .setStyle(TextInputStyle.Paragraph);
  
  
  const AOne = new ActionRowBuilder().addComponents(sorunnee);
  
  modal.addComponents(AOne);
  await interaction.showModal(modal);
  
  
    }


if(interaction.customId === 'onerilet'){
  const s1 = interaction.fields.getTextInputValue('sorunnee');
  await interaction.reply({ content: `Öneriniz Başarıyla kurucularımıza iletildi.`, ephemeral: true });
  let embed = new EmbedBuilder()
  .setDescription(`:tada: **Yeni Bir Öneri İletildi** :tada:

  **__Kullanıcı Hakkında__**
  **Kullanıcı:** ${interaction.member}
  **ID:** (\`${interaction.member.id}\`)
  
  **Önerisi:** ${s1}`)


  client.channels.cache.find(x => x.name == "oneri_ilet_log").wsend({ embeds: [embed]})
}
}
)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on(Events.InteractionCreate, async (interaction) => {

if (interaction.customId === 'sorunilet') {
  
  const modal = new ModalBuilder()
  .setCustomId("sorunilet")
  .setTitle("Sorun İlet")
  const sorunnee = new TextInputBuilder()
  .setCustomId("sorunnee")
  .setMinLength(10)
  .setLabel(`Sorun İlete Bilirsin`)
  .setPlaceholder("Örn: Sunucuda Çok Küfür Var")
  .setStyle(TextInputStyle.Paragraph);
  
  
  const AOne = new ActionRowBuilder().addComponents(sorunnee);
  
  modal.addComponents(AOne);
  await interaction.showModal(modal);
  
  
    }


if(interaction.customId === 'sorunilet'){
  const s1 = interaction.fields.getTextInputValue('sorunnee');
  await interaction.reply({ content: `Sorununuz Başarıyla kurucularımıza iletildi.`, ephemeral: true });
  let embed3 = new EmbedBuilder()
  .setDescription(`hey ${interaction.member} adlı üye bir sorununu belirtti.\n`)
  embed3.addFields([{name: `Üye Bilgileri;`,value: `${interaction.member} - (\`${interaction.member.id}\`)`,}])  
  embed3.addFields([{name: `Sorunu;`,value: `${s1}`,}])  

  client.channels.cache.find(x => x.name == "sorun-ilet_log").wsend({ embeds: [embed3]})
}
}
)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const kanalIDler = [`1310775417472548934`,`1310781844396183614`,`1310775429640093766`]; // Etiketleme yapacağın kanal ID'leri
client.on(Events.GuildMemberAdd, async (member) => {
  // Kanalları kontrol et
  for (const kanalID of kanalIDler) {
      const kanal = member.guild.channels.cache.get(kanalID);
      if (kanal) {
          // Kanaldaki mesajları etiketle
          const mesajlar = await kanal.messages.fetch({ limit: 1 }); // Son 10 mesajı getir (veya ihtiyacına göre ayarla)
          mesajlar.each(async (mesaj) => {
              try {
                await mesaj.channel.send(`${member}`).then((e) => setTimeout(() => { e.delete(); }, 3000)); 
              } catch (error) {
                  console.error('Mesajı etiketleme hatası:', error);
              }
          });
      }
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'ybasvuru') {
      const modal = new ModalBuilder()
          .setCustomId('ybasvuru')
          .setTitle('Yetkili Başvuru Formu');
      
      const soru1 = new TextInputBuilder()
          .setCustomId('soru1')
          .setLabel('İsim ve yaşınızı giriniz.')
          .setPlaceholder('Örnek: ancient 20')
          .setStyle(TextInputStyle.Short);
      
      const soru2 = new TextInputBuilder()
          .setCustomId('soru2')
          .setLabel('Discorda ne kadar süre ayırabilirsin?')
          .setPlaceholder('Örnek: Günlük 3 Saat')
          .setStyle(TextInputStyle.Short);
      
          const soru3 = new TextInputBuilder()
          .setCustomId('soru3')
          .setLabel('Sunucumuzda daha önceden yetkili oldun mu?')
          .setPlaceholder('Evet veya Hayır')
          .setStyle(TextInputStyle.Short);
      
      const soru4 = new TextInputBuilder()
          .setCustomId('soru4')
          .setLabel('Neden Yetkili Olmak?')
          .setPlaceholder('Bize Neler Katabilirsiniz')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(10);
      
      const AOne = new ActionRowBuilder().addComponents(soru1);
      const ATwo = new ActionRowBuilder().addComponents(soru2);
      const AThree = new ActionRowBuilder().addComponents(soru3);
      const AFour = new ActionRowBuilder().addComponents(soru4);
      
      modal.addComponents(AOne, ATwo, AThree, AFour);
      await interaction.showModal(modal);
  }

  
  const { MessageFlags } = require('discord.js'); // MessageFlags'ı import et

if (interaction.isModalSubmit() && interaction.customId === 'ybasvuru') {
    const s1 = interaction.fields.getTextInputValue('soru1');
    const s2 = interaction.fields.getTextInputValue('soru2');
    const s3 = interaction.fields.getTextInputValue('soru3');
    const s4 = interaction.fields.getTextInputValue('soru4');

    // Başvuru başarılı mesajı
    await interaction.reply({ content: 'Yetkili Başvurunuz başarıyla iletildi.', flags: [MessageFlags.Ephemeral] });

    // Embed mesajını oluştur
    const embed = new EmbedBuilder()
        .setDescription(`Hey ${interaction.member} adlı üye yetkili başvurusunda bulundu.\n`)
        .addFields([
            { name: 'Üye Bilgileri', value: `${interaction.member} - (\`${interaction.member.id}\`)` },
            { name: 'İsim Yaş', value: s1 },
            { name: 'Discorda ne kadar süre ayırabilirsin?', value: s2 },
            { name: 'Daha önce yetkili oldunuz mu?', value: s3 },
            { name: 'Neden Yetkili Olmak?', value: s4 },
        ]);

    // Log kanalını bul
    const logChannel = client.channels.cache.find(x => x.name.toLowerCase() === "başvuru-log".toLowerCase());

    // Kanal bulunamadıysa hata mesajı ver
    if (!logChannel) {
        console.error('Log channel not found.');
        return; // Kanal bulunamadığında işlemi durdur
    }

    // Embed mesajını log kanalına gönder
    logChannel.send({ embeds: [embed] })
        .catch(error => {
            console.error('Mesaj gönderme hatası:', error);
        });
}


});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'ymazeret') {
      const modal = new ModalBuilder()
          .setCustomId('ymazeret')
          .setTitle('Yetkili Mazeret Başvuru Formu');
      
      const soru1 = new TextInputBuilder()
          .setCustomId('soru1')
          .setLabel('İsim Girin')
          .setStyle(TextInputStyle.Short);
      
      const soru2 = new TextInputBuilder()
          .setCustomId('soru2')
          .setLabel('Yetki')
          .setStyle(TextInputStyle.Short);
      
          const soru3 = new TextInputBuilder()
          .setCustomId('soru3')
          .setLabel('Sebeb?')
          .setStyle(TextInputStyle.Short);
      
      const soru4 = new TextInputBuilder()
          .setCustomId('soru4')
          .setLabel('Süre?')
          .setStyle(TextInputStyle.Paragraph)
      
      const AOne = new ActionRowBuilder().addComponents(soru1);
      const ATwo = new ActionRowBuilder().addComponents(soru2);
      const AThree = new ActionRowBuilder().addComponents(soru3);
      const AFour = new ActionRowBuilder().addComponents(soru4);
      
      modal.addComponents(AOne, ATwo, AThree, AFour);
      await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'ymazeret') {
      const s1 = interaction.fields.getTextInputValue('soru1');
      const s2 = interaction.fields.getTextInputValue('soru2');
      const s3 = interaction.fields.getTextInputValue('soru3');
      const s4 = interaction.fields.getTextInputValue('soru4');

      await interaction.reply({ content: 'Yetkili Mazeret Başvuru başarıyla iletildi.', ephemeral: true });

      const embed = new EmbedBuilder()
          .setDescription(`${interaction.member} adlı üye Yetkili Mazeret başvurusunda bulundu.\n
            
> \`.mazaret\` **Kişi/İD Berlitin Onay / Red verin**`)
          .addFields([
              { name: 'Üye Bilgileri', value: `${interaction.member} - (\`${interaction.member.id}\`)` },
              { name: 'İsim', value: s1 },
              { name: 'Yetki?', value: s2 },
              { name: 'Sebeb?', value: s3 },
              { name: 'Süre?', value: s4 },
          ]);

      client.channels.cache.find(x => x.name == "mazeret_log").wsend({ embeds: [embed]})
      if (logChannel) {
          logChannel.send({ embeds: [embed],  });
      } else {
          console.error('Log channel not found.');
      }
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'ysponsor') {
      const modal = new ModalBuilder()
          .setCustomId('ymazeret')
          .setTitle('Sponsor Başvuru Formu');
      
      const soru1 = new TextInputBuilder()
          .setCustomId('soru1')
          .setLabel('İsim Girin')
          .setStyle(TextInputStyle.Short);
      
      const soru2 = new TextInputBuilder()
          .setCustomId('soru2')
          .setLabel('Hediyeniz')
          .setStyle(TextInputStyle.Short);
      
          const soru3 = new TextInputBuilder()
          .setCustomId('soru3')
          .setLabel('Kendiniz Hakkında Bilgi?')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(10);

      const AOne = new ActionRowBuilder().addComponents(soru1);
      const ATwo = new ActionRowBuilder().addComponents(soru2);
      const AThree = new ActionRowBuilder().addComponents(soru3);
      
      modal.addComponents(AOne, ATwo, AThree);
      await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'ysponsor') {
      const s1 = interaction.fields.getTextInputValue('soru1');
      const s2 = interaction.fields.getTextInputValue('soru2');
      const s3 = interaction.fields.getTextInputValue('soru3');

      await interaction.reply({ content: 'Sponsor Başvuru başarıyla iletildi.', ephemeral: true });

      const embed = new EmbedBuilder()
          .setDescription(`${interaction.member} adlı üye Sponsor başvurusunda bulundu.`)
          .addFields([
              { name: 'Üye Bilgileri', value: `${interaction.member} - (\`${interaction.member.id}\`)` },
              { name: 'İsim', value: s1 },
              { name: 'Yetki?', value: s2 },
              { name: 'Sebeb?', value: s3 },
          ]);

      client.channels.cache.find(x => x.name == "sponsor-log").wsend({ embeds: [embed]})
      if (logChannel) {
          logChannel.send({ embeds: [embed],  });
      } else {
          console.error('Log channel not found.');
      }
  }
});