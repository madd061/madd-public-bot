const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const safel = require("../../../../../Protection/src/Models/Safe");
const { botSettings } = require('../../../../../../config.json');
const { red } = require("../../../../src/configs/emojis.json");
const { owners } = require("../../../../../../config.json");  // owners'ı config'den alıyoruz

module.exports = {
    conf: {
        aliases: ["safe"],
        name: "safe",
        help: "safe",
        category: "sahip",    
        owner: true,
    },

    run: async (client, message, args, embed) => {

        if (message.guild === null) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setThumbnail()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setDescription(`${red} Bu komutu sadece Sunucuda kullanabilirsin`)
            ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        } else if (!owners.includes(message.author.id)) {  // owners'ı kontrol ediyoruz
            return message.reply({ embeds: [new EmbedBuilder()
                .setThumbnail()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setDescription(`${red} Bot developerı olmadığın için kurulumu yapamazsın`)
            ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
        } else {

            if (!message.guild) return message.channel.send({ content: "Bu komut sadece sunucularda kullanılabilir." });

            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
            if (!member) return message.channel.send({ content: `Bir kişi belirtmelisin.` });
            
            const safeData = await safel.findOne({ guildID: message.guild.id });
            if (!safeData) return message.channel.send({ content: `Veritabanında güvenli verisi bulunamadı.` });

            const allOptions = Object.keys(safeData.schema.paths);
            const hiddenFields = ['guildID', 'safe', 'Permissions', '__v', '_id', 'SafeRole'];
            const filteredOptions = allOptions.filter(option => !hiddenFields.includes(option));

            let row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('safe_menu')
                        .setPlaceholder(`${member.user.username} Kişisini Safe Ekle/Çıkar`)
                        .addOptions(
                            filteredOptions.map(option => ({
                                label: option,
                                value: option,
                                description: `Safe Ekle/Çıkar: ${option}`
                            }))
                        )
                );

            let messageSent = await message.channel.send({ content: `**${member.user.username}** için bir işlem seçin`, components: [row] });

            const filter = i => i.customId === 'safe_menu' && i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 10000 });

            collector.on('collect', async (i) => {
                const selectedOption = i.values[0]; 
                if (filteredOptions.includes(selectedOption)) {
                    const safeField = safeData[selectedOption];

                    if (safeField && safeField.includes(member.id)) {
                        await safel.updateOne({ guildID: message.guild.id }, { $pull: { [selectedOption]: member.id } });
                        message.channel.send({ content: `**${selectedOption}** başarıyla kaldırıldı.`, ephemeral: true });
                    } else {
                        await safel.updateOne({ guildID: message.guild.id }, { $addToSet: { [selectedOption]: member.id } }, { upsert: true });
                        message.channel.send({ content: `Başarıyla **${selectedOption}** yetkisi verildi.`, ephemeral: true });
                    }
                    messageSent.edit({ components: [] });
                    collector.stop();
                } else {
                    message.channel.send({ content: `Geçersiz seçenek.` });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    messageSent.edit({ content: `Zaman aşımı`, components: [] });
                }
            });
        }
    }
};
