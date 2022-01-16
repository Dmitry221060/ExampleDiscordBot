const config = require("../../config");
const MongoClient = require("mongodb").MongoClient;

module.exports = async () => {
  const client = await MongoClient.connect(config.db.url, { useUnifiedTopology: true });
  
	return { client };
};
