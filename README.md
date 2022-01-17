# Example Discord Bot
This repository is an example of discord bot, based on [discord.js](https://github.com/discordjs/discord.js) library. You can also use it as an architecture template for your bot.


# Features
* **Tasks**
  * Functions that run with a specified interval.
  * Example: [SayHiTask](src/tasks/sayHi.js)

* **Data repository**
  * In-memory key–value database abstraction over MongoDB. You can think about it as Map that keeps its values even after you relaunch the bot.
  * Example usage: [sayHi.js#L42-L47](src/tasks/sayHi.js#L42-L47)

* **Configurable commands**
  * You can easily add commands that have aliases, can be used only in specified channels, only by specified users or just disabled.
  * Example: [commandList#L115-L122](src/commands/commandList.js#L115-L122)

* **Preconfigured logger**
  * Ready to use Logger based on [winston](https://www.npmjs.com/package/winston) with 3 different levels(debug, info, error) and parallel writing to files and stdout.
  * Interface: [logger.js#L96-L105](src/utils/logger.js#L96-L105)

* **Fault tolerance**
  * All, or at least all known sources of errors have proper error handling. In case of an uncaught error or unhandled promise rejection, global handler in logger will make sure that the exception is written into logs, will attempt to quit softly and if unsuccessful, forcefully kills the process. That allows to quickly recover from fatal failures, make sure that program is working correctly and that exception won't go unnoticed.

* **Extensibility**
  * This project can be used as a template or boilerplate for your bot and easily extended with any functionality.


# Configuration
Use [config.js](config.js) to change bot prefixes and specify servers that bot will be runned at. If you don't need greetings/logging feature you can just remove those fields.

Create .env file, based on [.env.example](.env.example) to specify your bot token and Mongo connection string.
