const logger = require("../utils/logger");
const config = require("../../config").tasks.sayHi;
const { interval, message, outputChannelIds } = config;
const Task = require("./Task");
const DataRepository = require("../database/dataRepository");

class SayHiTask extends Task {
  #timer = null;
  #client = null;
  #dataRepository = null;

  constructor() {
    super(true);
  }

  async register(client, timerInterval = interval) {
    if (timerInterval == null) return logger.info("No interval specified for SayHiTask");

    this.#client = client;
    this.#dataRepository = new DataRepository();
    await this.#dataRepository.init();
    this.#timer = setInterval(() => this.execute(), timerInterval);
  }

  unRegister() {
    clearInterval(this.#timer);
    this.#dataRepository.destroy();

    this.#timer = null;
    this.#client = null;
    this.#dataRepository = null;
  }

  async execute() {
    if (this.#client == null) {
      logger.error(`Failed to execute SayHiTask with id ${this.#timer}: Discord client was not defined.`);
      return this.unRegister();
    }

    for (const channelId of outputChannelIds) {
      try {
        let hiCounter = await this.#dataRepository.get(`${channelId}.hiCounter`);

        await this.#client.channels.cache.get(channelId).send(message);
        hiCounter++;

        await this.#dataRepository.set(`${channelId}.hiCounter`, hiCounter);
      } catch(error) {
        logger.error(`Failed to say hi in the channel with id ${channelId}`, error);
      }
    }
  }
}

module.exports = SayHiTask;
