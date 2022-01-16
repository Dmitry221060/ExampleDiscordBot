const logger = require("../utils/logger");
const config = require("../../config");
const { commands, commandNames } = require("./commandList");

const commandsHandler = async (client, msg) => {
  if (msg.channel.type === "dm" || msg.channel.type === "group") return;

  const messageContent = msg.content.replace(/ {2,}/g, " ") || "";
  logger.debug(`Guild: ${
    msg.guild && msg.guild.name || "DM"
  } | Channel: ${
    msg.channel.name
  } | Author: ${
    msg.author.username
  } | Content: ${
    messageContent
  }`);

  if (msg.author.bot) return;
  const prefix = config.bot.prefixes.find(prefix => messageContent.indexOf(prefix.toLowerCase()) === 0);
  if (prefix === undefined) return;

  const commandAndParams = messageContent.slice(prefix.length).split(" ");
  const userCommand = commandAndParams.shift().toLowerCase();
  const params = commandAndParams.join(" ");

  if (!commandNames.includes(userCommand))
    return await msg.channel.send("Provided command was not found.");

  const command = commands.find(cmd =>
    cmd.name === userCommand || cmd?.aliases?.includes(userCommand)
  );

  if (!command || command.disabled) return await msg.channel.send("Provided command was not found.");
  if (command.allowedChannels && !command.allowedChannels?.includes(msg.channel.id)) return;
  if (command.allowedUsers && !command.allowedUsers?.includes(msg.author.id.userID)) return;

  await command.handler({ client, msg, params });
}

module.exports = {
  commandsHandler
};
