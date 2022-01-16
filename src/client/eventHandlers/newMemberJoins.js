const config = require("../../../config");
const logger = require("../../utils/logger");
const { randomOf } = require("../../utils");
const greetings = require("../../assets/greetings");

const onNewMemberJoin = async member => {
  try {
    const server = config.bot.servers.find(e => e.id === member.guild.id);
    if (!server && !server.greetingsChannel) return;

    const greeting = randomOf(greetings)(member);

    await member.guild.channels.cache.get(server.greetingsChannel).send(greeting, { allowedMentions: null });
  } catch(error) {
    logger.error("Failed to handle new member connection to the server", error);
  }
};

module.exports = onNewMemberJoin;
