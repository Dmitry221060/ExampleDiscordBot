const config = {
  bot: {
    prefixes: ["!"],
	status: "!help",
    maxWikiSearchResults: 3, // Should be in the 1 to 100 interval
    servers: [
      {
        id: "000000000000000000",
        logsChannelId: "000000000000000000",
        greetingsChannel: "000000000000000000"
      }
    ]
  },

  logger: {
    consoleOutput: false
  },

  db: {
    url: process.env.mongodbURL,
    dataRepository: {
      dbName: "dataRepository"
    }
  },

  tasks: {
    crawlVKPosts: {
      interval: 5*60*1000, // 5 minutes
      groupIds: [-000000000, -000000001],
      postsPerRequest: 20, // Should be in the 1 to 100 interval
      outputChannelIds: ["000000000000000000"]
    }
  }
}

module.exports = config;
