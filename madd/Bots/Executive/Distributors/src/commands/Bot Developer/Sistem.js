const { SelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const guildCoinSystem = require("../../../../src/schemas/coinsystem");
const statSystemDB = require("../../../../src/schemas/statsystem")
module.exports = {
    conf: {
        aliases: ["sistem"],
        name: "sistem",
        help: "sistem",
        category: "sahip",
        owner: true,
    },

    run: async (client, message, args, embed) => {
        if (args[0] === "durum") {
            try {
                const levelsistem = await GuildLevelSystem.findOne({ guildID: message.guild.id });
                const level = levelsistem ? levelsistem.levelSystem : false;
                const statsistem = await statSystemDB.findOne({ guildID: message.guild.id });
                const stat = statsistem ? statsistem.statSystem : false;
                const tagsistem = await guildTag.findOne({ guildID: message.guild.id });
                const tag = tagsistem ? (tagsistem.only ? `Açık: ${tagsistem.Type}` : "Kapalı") : "Kapalı";
                const yasaklıtagsistem = guildBannedTag.findOne({ guildID: message.guild.id });
                const yasaklıtag = yasaklıtagsistem ? yasaklıtagsistem.only : false;
                const invitesistem = await guildInviteSystemDB.findOne({ guildID: message.guild.id });
                const invite = invitesistem ? invitesistem.InviteSystem : false;
                const coinsystemdb = await guildCoinSystem.findOne({ guildID: message.guild.id });
                const Coin_system = coinsystemdb ? coinsystemdb.coinSystem : false;
                const missionsystemdb = await missionsystem.findOne({ guildID: message.guild.id });
                const mission_system = missionsystemdb ? missionsystemdb.only : false;
                const sistemEmoji = "•";
                const tik = message.guild.emojis.cache.find((x) => x.name === "appEmoji_tik") || "✅";
                const carpi = message.guild.emojis.cache.find((x) => x.name === "appEmoji_carpi") || "❎";

                return message.reply({
                    embeds: [embed.setDescription(`# Sistemlerin durumu aşağıda sıralanmıştır.
                    **${sistemEmoji} ${Coin_system === true ? `Ekonomi Sistemi: ${tik}` : `Ekonomi Sistemi: ${carpi}`}
                    ${sistemEmoji} ${stat ? `İstatistik Sistemi: ${tik}` : `İstatistik Sistemi: ${carpi}`}
                    **`)],
                });
            } catch (err) {
                console.error(err);
                return message.channel.send("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
            }
        }

        try {
            let menu = new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId("sistem")
                    .setPlaceholder("Menüden uygun sistemi seçiniz.")
                    .addOptions([
                        { label: "Ekonomi Sistemi", description: undefined, value: "coin" },
                        { label: "İstatistik Sistemi", description: undefined, value: "stat" },
                    ])
            );

            let msg = await message.channel.send({
                components: [menu],
                embeds: [
                    embed.setDescription(
                        `Aşağıda gördüğünüz menüden sunucunuza uygun olucak sistemleri aktif edebilir ve gerekli ayarlarını yapabilirsiniz.`
                    ),
                ],
            });

            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async (interaction) => {
                const selected = interaction.values[0];

                switch (selected) {
                    case 'coin':
                        await toggleCoinSystem(message);
                        break;
                    case 'stat':
                        await toggleStatSystem(message);
                        break;
                    // Add cases for other systems
                }
                await msg.delete(); // Menüyü sil
            });

            collector.on('end', async () => {
                await msg.delete().catch(console.error); // Menüyü kapat
            });

        } catch (err) {
            console.error(err);
            return message.channel.send("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
        }
    }
};

async function toggleCoinSystem(message) {
    try {
        const coinsystemdb = await guildCoinSystem.findOne({ guildID: message.guild.id });
        const Coin_system = coinsystemdb ? coinsystemdb.coinSystem : false;

        if (!coinsystemdb || Coin_system === false) {
            await guildCoinSystem.findOneAndUpdate(
                { guildID: message.guild.id },
                { coinSystem: true },
                { upsert: true }
            );

            return message.reply({ content: "**Ekonomi Sistemi** Aktif edildi", ephemeral: true });
        } else {
            await guildCoinSystem.findOneAndUpdate(
                { guildID: message.guild.id },
                { coinSystem: false },
                { upsert: true }
            );

            return message.reply({ content: "**Ekonomi Sistemi** Kapatıldı!", ephemeral: true });
        }
    } catch (err) {
        console.error(err);
        return message.channel.send("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
    }
}

async function toggleStatSystem(message) {
    try {
        const statsistemdb = await statSystemDB.findOne({ guildID: message.guild.id });
        const Stat_system = statsistemdb ? statsistemdb.statSystem : false;

        if (!statsistemdb || Stat_system === false) {
            await statSystemDB.findOneAndUpdate(
                { guildID: message.guild.id },
                { statSystem: true },
                { upsert: true }
            );

            return message.reply({ content: "**İstatistik Sistemi** Aktif edildi", ephemeral: true });
        } else {
            await statSystemDB.findOneAndUpdate(
                { guildID: message.guild.id },
                { statSystem: false },
                { upsert: true }
            );

            return message.reply({ content: "**İstatistik Sistemi** Kapatıldı!", ephemeral: true });
        }
    } catch (err) {
        console.error(err);
        return message.channel.send("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
    }
}