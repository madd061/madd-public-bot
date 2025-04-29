const client = global.bot;
const conf = require("../../../src/configs/sunucuayar.json");

module.exports = async (oldMember, newMember) => {
    let kanal = client.channels.cache.get(conf.chatChannel);
    if (!kanal) return;

    // Eğer yeni üye booster rolü aldıysa (takviye bastıysa)
    if (!oldMember.roles.cache.has(conf.boosterRolu) && newMember.roles.cache.has(conf.boosterRolu)) {
        // Kanal varsa mesaj gönder
        kanal.send({ content: `${newMember} (\`${newMember.user.tag} - ${newMember.user.id}\`) sunucumuza takviye yaptı!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    // Eğer eski üyenin booster rolü varsa ve yeni üyenin yoksa (takviyeyi kaybettiyse)
    if (oldMember.roles.cache.has(conf.boosterRolu) && !newMember.roles.cache.has(conf.boosterRolu)) {
        // Kanal varsa mesaj gönder
        kanal.send({ content: `${newMember} (\`${newMember.user.tag} - ${newMember.user.id}\`) sunucumuzdaki takviyesini kaybetti ve kayıtsıza atıldı.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));

        // Kullanıcıyı ses kanalından at
        await newMember.voice.disconnect().catch(err => {});

        // Kullanıcı adı değiştir
        if (newMember && newMember.manageable) await newMember.setNickname(`• İsim`);

        // Kullanıcıya kayıtsız rollerini ver
        await newMember.roles.set(conf.unregRoles);
    }
};

module.exports.conf = {
  name: "guildMemberUpdate",
};
