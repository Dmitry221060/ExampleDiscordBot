const config = require("../../../config");
const logger = require("../../utils/logger");
const { commandsHandler } = require("../../commands");

const onMessage = async (client, msg) => {
  try {
    if (!config.bot.servers.find(e => e.id === msg?.guild?.id))
      return msg?.guild?.leave()?.then(() => logger.info("Bot leaved from unknown server: " + msg?.guild?.id));

    await commandsHandler(client, msg);
  } catch(err) {
    msg.channel.send("Failed to execute the command.");
    logger.error("Failed to execute the command message", err);
  }
};

module.exports = onMessage;
