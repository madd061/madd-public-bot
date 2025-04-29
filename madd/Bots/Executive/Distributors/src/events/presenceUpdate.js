const ancientla = require("../../../../../config.json")
const Seens = require("../../../src/schemas/seens")
const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const client = global.bot;

module.exports = async (oldPresence, newPresence) => {
    if(!newPresence) return;
    if(!newPresence.member) return;
    let uye = newPresence.guild.members.cache.get(newPresence.member.user.id) 
    if(!uye) return;
    if(uye.guild.id != ancientla.GuildID) return;
    if(uye && uye.presence && uye.presence.status == "offline") {
        await Seens.updateOne({userID: uye.id}, {$set: {"lastOffline": Date.now(),
        "last": {
            type: "OFFLINE",
            date: Date.now(),
        }}}, {upsert: true})
    } else if(uye && uye.presence && uye.presence.status != "offline") {
        await Seens.updateOne({userID: uye.id}, {$set: {"lastOnline": Date.now(), "lastSeen": Date.now(), "last": {
            type: "ONLINE",
            date: Date.now(),
        }}}, {upsert: true})
    }
}

module.exports.conf = {
    name: "presenceUpdate",
  };


client.on("userAvatarUpdate", async (user, oldAvatarURL, newAvatarURL) => {
    await Seens.updateOne({userID: user.id}, {$set: {
        "lastSeen": Date.now(),
        "lastAvatar": Date.now(),
        "last": {
            type: "AVATAR",
            date: Date.now(),
            new: newAvatarURL,
            old: oldAvatarURL,
        }
    }}, {upsert: true})

});

client.on("voiceChannelJoin", async (member, channel) => {
    await Seens.updateOne({userID: member.id}, {$set: {
        "lastSeen": Date.now(),
        "lastVoice": Date.now(),
        "last": {
            type: "VOICE",
            date: Date.now(),
            channel: channel.id,
        }
    }}, {upsert: true})
});

client.on("userUsernameUpdate", async (user, oldUsername, newUsername) => {
    await Seens.updateOne({userID: user.id}, {$set: {
        "lastSeen": Date.now(),
        "lastUsername": Date.now(),
        "last": {
            type: "USERNAME",
            date: Date.now(),
            new: newUsername,
            old: oldUsername,
        }
    }}, {upsert: true})
});

client.on("userDiscriminatorUpdate", async (user, oldUsername, newUsername) => {
    await Seens.updateOne({userID: user.id}, {$set: {
        "lastSeen": Date.now(),
        "lastDiscriminator": Date.now(),
        "last": {
            type: "DISCRIMİNATOR",
            date: Date.now(),
            new: newUsername,
            old: oldUsername,
        }
    }}, {upsert: true})
});

