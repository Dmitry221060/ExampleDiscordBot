require("dotenv").config();
const logger = require("./utils/logger");
const client = require("./client");
const token = process.env.botToken || "";

logger.info("Bot has been started");

client.login(token);
