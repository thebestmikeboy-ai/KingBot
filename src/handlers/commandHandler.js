const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.commandAliases = new Map();
    this.loadCommands();
  }

  loadCommands() {
    const commandDir = path.join(__dirname, '../commands');
    const categories = fs.readdirSync(commandDir);

    categories.forEach((category) => {
      const categoryPath = path.join(commandDir, category);
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

      files.forEach((file) => {
        try {
          const command = require(path.join(categoryPath, file));
          this.commands.set(command.name, command);

          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.commandAliases.set(alias, command.name);
            });
          }

          logger.info(`✅ Command geladen: ${command.name}`);
        } catch (error) {
          logger.error(`❌ Fehler beim Laden von ${file}: ${error.message}`);
        }
      });
    });

    logger.success(`🎮 ${this.commands.size} Commands erfolgreich geladen!`);
  }

  getCommand(commandName) {
    const realCommand = this.commandAliases.get(commandName) || commandName;
    return this.commands.get(realCommand);
  }

  async execute(sock, message, prefix, args) {
    const commandName = args[0].toLowerCase();
    const command = this.getCommand(commandName);

    if (!command) return false;

    try {
      await command.execute({
        sock,
        message,
        args: args.slice(1),
        prefix,
      });
      return true;
    } catch (error) {
      logger.error(`Fehler beim Ausführen von ${commandName}: ${error.message}`);
      return false;
    }
  }
}

module.exports = new CommandHandler();
