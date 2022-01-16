module.exports = client => ({
  ready: require("./onReady").bind(null, client),
  message: require("./onMessage").bind(null, client),
  messageUpdated: require("./messageUpdated"),
  messageDeleted: require("./messageDeleted"),
  guildMemberAdd: require("./newMemberJoins"),
});
