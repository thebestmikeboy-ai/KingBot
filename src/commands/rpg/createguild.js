const Guild = require('../../models/Guild');
const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'createguild',
  aliases: ['newguild', 'startguild'],
  description: 'Erstelle eine Gilde',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `🏰 Gilde erstellen!\n\nBeispiel: ${prefix}createguild Dragonslayer Drachen-Jäger Gilde\n\nFormat: ${prefix}createguild [Name] [Beschreibung...]`,
        });
      }

      const guildName = args[0];
      const description = args.slice(1).join(' ');

      const character = await RPGCharacter.findOne({ userId: sender });

      if (!character) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter!`,
        });
      }

      if (character.guildId) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist bereits in einer Gilde! Tritt erst aus mit ${prefix}leaveguild`,
        });
      }

      // Check ob Guildname existiert
      const existingGuild = await Guild.findOne({ guildName });
      if (existingGuild) {
        return await sock.sendMessage(from, {
          text: `❌ Eine Gilde mit diesem Namen existiert bereits!`,
        });
      }

      const newGuild = new Guild({
        guildId: `guild-${Date.now()}`,
        guildName,
        leader: sender,
        description,
        members: [{
          userId: sender,
          rank: 'Leader',
        }],
        guildBank: 1000, // Startguthaben
      });

      await newGuild.save();

      character.guildId = newGuild.guildId;
      await character.save();

      const guildText = `
✅ Gilde erstellt!\n\n🏰 Name: ${guildName}\n📝 Beschreibung: ${description}\n👑 Leader: ${character.characterName}\n💰 Gildenkasse: $1000\n\nWillkommen in deiner neuen Gilde! 🎉
      `;

      return await sock.sendMessage(from, {
        text: guildText,
      });
    } catch (error) {
      logger.error(`Fehler in createguild command: ${error.message}`);
    }
  },
};
