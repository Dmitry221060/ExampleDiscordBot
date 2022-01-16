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
		logger.debug(`#dataRepository get request to ${field}`);
		if (!this.#db) throw new Error("DataRepository is not initialized")

		if (this.#cache[field]) {
			logger.debug(`#dataRepository value of ${field} was found in cache: ${inspect(this.#cache[field])}`);
			return this.#cache[field];
		}

		const row = await this.#db.collection("botData").findOne({ field });
		const data = row?.value;

		logger.debug(`#dataRepository get response for ${field} value: ${inspect(data)}\nValue was cached as: ${this.#cache[field]}`);
		if (!this.#cache[field]) this.#cache[field] = data;

		return data;
	}

	async set(field, value) {
		try {
			logger.debug(`#dataRepository set request to ${field} with value: ${inspect(value)}`);
			if (!this.#db) throw new Error("DataRepository is not initialized");
			if (this.#cache[field] === value)
				return logger.debug(`#dataRepository set request was ignored: Provided value identical to the cached one`);

			await this.#db.collection("botData").updateOne({ field }, { $set: { value } }, { upsert: true });
			this.#cache[field] = value;

			logger.debug(`#dataRepository set request value ${inspect(value)} was written to ${field}`);
		} catch(err) {
			logger.error(`#dataRepository set request failed to write ${inspect(value)} into ${field}`, err);
		}
	}
};