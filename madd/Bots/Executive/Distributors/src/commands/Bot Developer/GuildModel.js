const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChannelType, StringSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder} = require('discord.js');
const  SetupModel  = require('../../../../src/schemas/GuildModel');
const SETTINGS = require('../../../../src/Option/Options');
// Register ayarlarını içeren obje
const registerSettings = require('../../../../src/Option/Options');
const moderationSettings = require('../../../../src/Option/Options');


module.exports = {
    conf: {
      aliases: ["guild"],
      name: "guild",
      help: "guild [Mesaj ID]",
      category: "sahip"
    },
  
    run: async (client, message, args) => {

        const casRegister = function (category) {
            const options = category.map(category => {
                return {
                    label: category.name,
                    value: category.value,
                    description: category.description
                };
            });
            return new StringSelectMenuBuilder()
                .setCustomId(`register`)
                .setPlaceholder(`Değişilecek kategoriyi seçiniz!`)
                .addOptions(options);
        }

        const casModeration = function (category) {
            const options = category.map(category => {
                return {
                    label: category.name,
                    value: category.value,
                    description: category.description
                };
            });
            return new StringSelectMenuBuilder()
                .setCustomId(`moderation`)
                .setPlaceholder(`Değişilecek moderasyon ayarlarını seçiniz!`)
                .addOptions(options);
        }

        const registerCategory = registerSettings.register; 
        const moderationCategory = moderationSettings.moderation; 

        const casRegisterMenu = new ActionRowBuilder().addComponents(casRegister(registerCategory));
        const casModerationMenu = new ActionRowBuilder().addComponents(casModeration(moderationCategory));
        
        const rowThree = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('Geri')
                    .setStyle(ButtonStyle.Danger)
            );

        const Embed = new EmbedBuilder()
            .setDescription(`**Aşağıdaki Menülerden** \`${message.guild.name}\` **Sunucusuna ait gelişmiş ayarları yapabilirsiniz !**`)
            .setAuthor({ name: "Setup System", iconURL: message.guild.iconURL() });
        let option;
        const question = await message.channel.send({ embeds: [Embed], components: [casRegisterMenu, casModerationMenu] })

        const collector = question.createMessageComponentCollector({
            time: 1000 * 60 * 10,
        })
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) return i.reply({ content: "Bu menüyü sadece komutu yazan kullanabilir.", ephemeral: true });
            if (i.customId === 'back') {
                i.update({embeds:[Embed],components:[casRegisterMenu, casModerationMenu]}).catch(() => { });
                return;
            }
            console.log(i.customId)
            if (i.customId === 'register' || i.customId === 'moderation') {
                option = Object.values(SETTINGS).flatMap(setting => setting.find((o) => o.value === i.values[0]))
                if (!option) return i.reply({ content: "Bir hata oluştu.", ephemeral: true });
                if (option[0].type === 'boolean') {
                    return i.update({
                        embeds: [Embed.setDescription(`**Aşağıdaki Menü'den** ${option[0].name} ayarını ayarlayabilirsiniz!`)],
                        components: [MenüOluştur(option)]
                    }).catch(() => { });
                }
                return i.update({
                    embeds: [Embed.setDescription(`**Aşağıdaki Menü'den** ${option[0].name} ayarını ayarlayabilirsiniz!`)],
                    components: [MenüOluştur(option), rowThree]
                }).catch(() => { });

            }
            else if (i.customId === 'role' || i.customId === 'channel' || i.customId === 'limit' || i.customId === 'boolean') {
                if (!option[0]) return i.reply({ content: "Bir hata oluştu.", ephemeral: true });
                i.reply({
                    content: `Başarıyla ${option[0].name} adlı ayar ${option[0].isMultiple ? [i.values] : i.values[0]} şeklinde ayarlandı.`,
                    ephemeral: true,
                });
                await SetupModel.updateOne(
                    { guildID: message.guildId },
                    { $set: { [`Setup.${option[0].value}`]: option[0].isMultiple ? i.values : i.values[0] } },
                    { upsert: true }
                );
            }

            else if(i.customId === 'tags'){
                return i.update({
                    embeds: [Embed.setDescription(`**Aşağıdaki Menü'den** ${option[0].name} taglarınızı görebilirsiniz!`)],
                    components: [MenüOluştur(option), rowThree]
                }).catch(() => { }); 
            } 
            else if (i.customId === 'open' || i.customId === 'close') {
                const Bool = i.customId === 'open' ? 'Acik' : 'Kapali'
                if (!option[0]) return i.reply({ content: "Bir hata oluştu.", ephemeral: true });
                i.reply({
                    content: `Başarıyla ${option[0].name} adlı ayar ${Bool} şeklinde ayarlandı.`,
                    ephemeral: true,
                });
                await SetupModel.updateOne(
                    { guildID: message.guildId },
                    { $set: { [`Setup.${option[0].value}`]: `${Bool}` } },
                    { upsert: true }
                ).catch((err) => { console.log(err) });
            }
        });
        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                const timeFinished = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('timefinished')
                            .setDisabled(true)
                            .setEmoji('⏱️')
                            .setStyle(ButtonStyle.Danger)
                    );
                question.edit({ components: [timeFinished] });
            }
        })
        function MenüOluştur(option) {
            let menü;
            if (option[0].type === 'role') {
                menü = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder({
                            custom_id: "role",
                            placeholder: `Role Ara...`,
                            max_values: option[0].isMultiple ? 25 : 1,
                            options: [
                                { label: option[0].name, description: option[0].description, value: option[0].value }
                            ]
                        }))
            } else if (option[0].type === 'channel') {
                menü = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder({
                            custom_id: 'channel',
                            placeholder: 'Kanal ara..',
                        })
                            .setChannelTypes(option[0].isVoice
                                ? [ChannelType.GuildVoice]
                                : option[0].isParent
                                    ? [ChannelType.GuildCategory]
                                    : [ChannelType.GuildText]))
            }
            else if (option[0].type === 'limit') {

                menü = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder({
                            custom_id: 'limit',
                            placeholder: 'Kayıtsız Komut Limiti seçiniz..',
                            max_values: 1,
                        })
                            .addOptions(option[0].limitler.map((l) => ({ label: l, value: l }))))
            }
            else if (option[0].type === 'string') {
                menü = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder({
                            custom_id: 'tags',
                            placeholder: 'Tag seçiniz..',
                            max_values: 1,
                        })
                        .addOptions(System.GuildTags.length > 0
                            ? System.GuildTags.map((l) => ({ label: l, value: l }))
                            : [{ label: "Tag Bulunamadı!", value: "no_tag" }]
                          ))

            }
            else if (option[0].type === 'boolean') {
                menü = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('open')
                            .setLabel('Açık')
                            .setStyle(ButtonStyle.Success)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close')
                            .setLabel('Kapalı')
                            .setStyle(ButtonStyle.Danger)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('back')
                            .setLabel('Geri')
                            .setStyle(ButtonStyle.Danger)
                    );
            }
            return menü; 
        }
    }
}