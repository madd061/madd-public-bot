const penals = require("../../../src/schemas/penals");
const { GuildMember, TextChannel, EmbedBuilder } = require("discord.js");
const client = global.bot;
const allah = require("../../../../../config.json");

module.exports = function (client) {
  client.fetchUser = async (userID) => {
    try {
      return await client.users.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  client.fetchBan = async (guild, userID) => {
    try {
      return await guild.bans.fetch(userID);
    } catch (err) {
      return undefined;
    }
  };

  client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  GuildMember.prototype.setRoles = function (roles) {
    if (!this.manageable) return;
    const newRoles = this.roles.cache.filter(x => x.managed).map(x => x.id).concat(roles);
    return this.roles.set(newRoles).catch(() => {});
  };

  TextChannel.prototype.sendEmbed = function (embed) {
    if (!embed || !embed.description) return;
    const text = embed.description;
    for (var i = 0; i < Math.floor(text.length / 2048) + 1; i++) {
      this.send(embed.setDescription(text.slice(i * 2048, (i + 1) * 2048)));
    }
  };
  
  TextChannel.prototype.wsend = async function (message) {
    const hooks = await this.fetchWebhooks();
    let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
    if (webhook) return webhook.send(message);
    webhook = await this.createWebhook({ name: client.user.username, avatar: client.user.avatarURL() });
    return webhook.send(message);
  };

  TextChannel.prototype.error = async function (message, text) {
    const ancient = await client.users.fetch("151769677293420544");
    const embed = new EmbedBuilder()
      .setAuthor({ name: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      .setFooter({ text: "Jaylen & " + message.guild.name, iconURL: ancient.avatarURL({ dynamic: true })});
    this.send(embed.setDescription(text)).then((x) => { if (x.deletable) x.delete({ timeout: 10000 }); });
  };

  client.penalize = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined) => {
    let id = await penals.find({ guildID });
    id = id ? id.length + 1 : 1;
    return await new penals({ id, userID, guildID, type, active, staff, reason, temp, finishDate }).save();
  };

  GuildMember.prototype.hasRole = function (role, every = true) {
    return (Array.isArray(role) && (every && role.every((x) => this.roles.cache.has(x)) || !every && role.some((x) => this.roles.cache.has(x))) || !Array.isArray(role) && this.roles.cache.has(role))
  };

  Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
  };
};
