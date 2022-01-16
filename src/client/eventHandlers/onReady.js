const logger = require("../../utils/logger");
const config = require("../../../config");
const tasks = require("../../tasks");

const onReady = async client => {
  try {
    logger.info("Account authorized");

    await tasks.register(client);
    await tasks.execute();

	await client.user.setActivity(config.bot.status);
  } catch(err) {
    logger.error("Failed to handle onReady event", err);
  }
};

module.exports = onReady;
