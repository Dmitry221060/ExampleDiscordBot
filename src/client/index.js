const Discord = require("discord.js");
const client = new Discord.Client({ allowedMentions: { parse: [] } });

const eventHandlers = require("./eventHandlers")(client);

client.on("ready", eventHandlers.ready);
client.on("message", eventHandlers.message);
client.on("messageUpdate", eventHandlers.messageUpdated);
client.on("messageDelete", eventHandlers.messageDeleted);
client.on("guildMemberAdd", eventHandlers.guildMemberAdd);

module.exports = client;
