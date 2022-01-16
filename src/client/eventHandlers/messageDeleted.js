const config = require("../../../config");
const logger = require("../../utils/logger");

const onMessageDelete = async deletedMsg => {
  try {
    const server = config.bot.servers.find(e => e.id === deletedMsg?.guild?.id);
    if (!server || !server.logsChannelId) return;

    const deletedMsgAttachments = deletedMsg.attachments.map(e => e.url);
    if (!deletedMsg.content && !deletedMsgAttachments.length) return;

    await deletedMsg.guild.channels.cache.get(server.logsChannelId).send({
      embed: {
        title: "#" + deletedMsg.channel.name,
        author: {
          name: deletedMsg.member.displayName,
          iconURL: deletedMsg.author.displayAvatarURL({ size: 64 })
        },
        color: 15148325,
        fields: [
          {
            name: "Deleted message",
            value: deletedMsg.content + (deletedMsgAttachments.length ? "\n{<" + deletedMsgAttachments.join(">\n<") + ">}" : "")
          }
        ],
        timestamp: Date.now()
      },
      split: true
    });
  } catch(err) {
    logger.error("Failed to handle messageDelete event", err);
  }
};

module.exports = onMessageDelete;
