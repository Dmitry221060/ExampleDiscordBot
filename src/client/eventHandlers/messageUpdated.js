const config = require("../../../config");
const logger = require("../../utils/logger");

const onMessageUpdate = async (oldMsg, newMsg) => {
  try {
    if (oldMsg.content === newMsg.content) return;
    const server = config.bot.servers.find(e => e.id === oldMsg?.guild?.id);
    if (!server || !server.logsChannelId) return;

    const oldMsgAttachments = oldMsg.attachments.map(e => e.url);
    const newMsgAttachments = newMsg.attachments.map(e => e.url);

    await oldMsg.guild.channels.cache.get(server.logsChannelId).send({
      embed: {
        title: "#" + oldMsg.channel.name,
        author: {
          name: oldMsg.member.displayName,
          iconURL: oldMsg.author.displayAvatarURL({ size: 64 })
        },
        color: 15181349,
        fields: [
          {
            name: "Old content",
            value: oldMsg.content + (oldMsgAttachments.length ? "\n{<" + oldMsgAttachments.join(">\n<") + ">}" : "")
          },
          {
            name: "New content",
            value: newMsg.content + (newMsgAttachments.length ? "\n{<" + newMsgAttachments.join(">\n<") + ">}" : "")
          }
        ],
        timestamp: newMsg?.editedTimestamp || Date.now()
      },
      split: true
    });
  } catch(err) {
    logger.error("Failed to handle messageUpdate event", err);
  }
};

module.exports = onMessageUpdate;
