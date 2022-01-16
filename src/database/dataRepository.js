const { dataRepository } = require("../../config").db;
const logger = require("../utils/logger");
const createDBConnection = require("../database");
const { inspect } = require("util");

module.exports = class DataRepository {
	#cache = {};
	#connection = null;
	#db = null;

	async init() {
		this.#connection = await createDBConnection();
		this.#db = this.#connection.client.db(dataRepository.dbName);
	}

	async destroy() {
		await this.#connection.close();
		this.#cache = {};
		this.#connection = null;
		this.#db = null;
	}

	async get(field) {
		logger.debug(`Запрос данных поля ${field}`);
		if (!this.#db) throw new Error("DataRepository is not initialized")

		if (this.#cache[field]) {
			logger.debug(`Ответ на запрос поля ${field}, возвращено кэшированное значение ${inspect(this.#cache[field])}`);
			return this.#cache[field];
		}
		
		const row = await this.#db.collection("botData").findOne({ field });
		const data = row?.value;

		logger.debug(`Ответ на запрос поля ${field}: ${inspect(data)}\nКэшированное значение: ${this.#cache[field]}`);
		if (!this.#cache[field]) this.#cache[field] = data;

		return data;
	}

	async set(field, value) {
		try {
			logger.debug(`Запись значения ${inspect(value)} в поле ${field}`);
			if (!this.#db) throw new Error("DataRepository is not initialized");
			if (this.#cache[field] === value) return logger.debug(`Значение не было записано т.к. оно совпадает со значением в кэше.`);

			await this.#db.collection("botData").updateOne({ field }, { $set: { value } }, { upsert: true });
			this.#cache[field] = value;

			logger.debug(`Значение ${inspect(value)} записано в поле ${field}`);
		} catch(err) {
			logger.error(`Не удалось записать значение ${inspect(value)} записано в поле ${field}`, err);
		}
	}
};