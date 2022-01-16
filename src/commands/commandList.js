const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const { randomOf, dayOfYear, searchOnWiki: searchOnWiki } = require("../utils");
const logger = require("../utils/logger");
const quotes = require("../assets/quotes").entries;
const dailyQuotes = require("../assets/dailyQuotes").entries;
const shitposts = require("../assets/shitposts");
const shitpostsString = "**" + shitposts.map(e => e[0]).join("** | **") + "**";
const botPrefix = config.bot.prefixes[0];

const commands = [
  {
    name: "help",
    aliases: ["h", "commands", "c"],
    allowedChannels: ["664375835448442894", "782247142924091442"],
    description: "Returns list of commands",
    example: "!help [commandName]",
    handler: async ({ msg, params }) => {
      const activeCommands = commands.filter(c => !c.disabled);
      if (!params) {
        return await msg.channel.send({
          embed: {
            color: 0x00ae86,
            title: "List of commands",
            description: `To get info about specific command, use\n${botPrefix}help <commandName>`,
            fields: activeCommands.map(e => ({
              name: "❯ " + e.name,
              value: e.description || "No description"
            }))
          }
        });
      }

      const commandName = params.toLowerCase();
      const command = activeCommands.find(e => e.name === commandName || e.aliases?.includes(commandName));
      if (!command) return await msg.channel.send("Provided command was not found.");

      const embed = new MessageEmbed({
        color: 0x00ae86,
        title: "Command " + command.name,
        description: `${command.description}\nExample: ${command.example || (botPrefix + command.name)}`
      });

      if (command.allowedChannels)
        embed.addField(
          "❯ Allowed channels",
          "<#" + command.allowedChannels.join(">, <#") + ">"
        );

      if (command.allowedUsers)
        embed.addField(
          "❯ Allowed users",
          "<@!" + command.allowedUsers.join(">, <@!") + ">"
        );

      if (command.aliases)
        embed.addField(
          "❯ Aliases",
          command.aliases.join(", ")
        );

      await msg.channel.send({ embed });
    }
  },
  {
    name: "quote",
    aliases: ["qu", "q"],
    allowedChannels: ["664375835448442894", "782247142924091442"],
    description: "Sends random quote from predefined pool",
    example: "!quote",
    handler: async ({ msg }) => {
      const quote = randomOf(quotes);
      await msg.channel.send(quote[0] + "\n\n" + quote[1]);
    }
  },
  {
    name: "dailyQuote",
    disabled: true,
    aliases: ["dqu", "dq", "hodie"],
    allowedChannels: ["664375835448442894", "782247142924091442"],
    description: "Sends quote of the day",
    example: "!dailyQuote",
    handler: async ({ msg }) => {
      const numberOfDayInYear = dayOfYear(new Date());
      const quote = dailyQuotes[numberOfDayInYear];
      await msg.channel.send(quote);
    }
  },
  {
    name: "shitposts",
    aliases: ["shitpost", "shit", "s"],
    allowedChannels: ["664375835448442894", "782247142924091442"],
    description: "Sends unfunny jokes",
    example: "!shitposts [shitpostName]",
    handler: async ({ msg, params }) => {
      if (!params)
        return await msg.channel.send(
          "List of shitposts:\n" +
          shitpostsString
        );

      const matchedShitposts = shitposts.filter(e => e[0].startsWith(params.toLowerCase()));
      if (!matchedShitposts.length)
        return await msg.channel.send(
          "Shitpost was not found. List of shitposts:\n" +
          shitpostsString
        );

      if (matchedShitposts.length !== 1)
        return await msg.channel.send(
          "Found several matching shitpost, clarify your input:\n" +
          "**" + matchedShitposts.map(e => e[0]).join("** | **") + "**"
        );

      await msg.channel.send(matchedShitposts[0][1]);
    }
  },
  {
    name: "wiki",
    aliases: ["w", "wikipedia", "dic"],
    allowedChannels: ["664375835448442894", "782247142924091442"],
    description: "Sends link to wiki dictionary",
    example: "!wiki Caesar",
    handler: async ({ msg, params }) => {
      const {
        data: searchData,
        error: searchError
      } = await searchOnWiki(params);

      if (searchData === null) {
        logger.error("Failed to execute the wiki search", searchError);
        return await msg.channel.send(`<https://en.wiktionary.org/wiki/${params}#Latin>`);
      }

      const urls = searchData[3].map(url => `<${url}#Latin>`);

      if (searchData[1][0] === searchData[0])
        return await msg.channel.send(urls[0]);

      await msg.channel.send("Results based on your input:\n" + urls.join("\n"));
    }
  },
];

const commandNames = [];
for (const command of commands) {
  if (!command.name || !command.handler) {
    logger.error("Command without namd or handler detected", command);
    throw new Error("Invalid command found");
  }

  command.name = command.name.toLowerCase();
  command.aliases = command.aliases?.map(e => e.toLowerCase()) || [];

  if (commandNames.includes(command.name))
    throw new Error(`Command ${command.name} has non unique name`);
  commandNames.push(command.name);

  if (command.aliases.some(alias => commandNames.includes(alias)))
    throw new Error(`Command ${command.name} has non unique alias`);
  commandNames.push(...command.aliases);
}

module.exports = {
  commands,
  commandNames,
};
