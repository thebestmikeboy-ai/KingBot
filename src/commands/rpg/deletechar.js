const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'deletChar',
  aliases: ['delchar', 'removechar'],
  description: 'Lösche deinen Charakter',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args[0]?.toLowerCase() !== 'bestätigen') {
        return await sock.sendMessage(from, {
          text: `⚠️ WARNUNG: Dies löscht deinen Charakter permanent!\n\nBestätige mit: ${prefix}deletechar bestätigen`,
        });
      }

      const character = await RPGCharacter.findOne({ userId: sender });

      if (!character) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter!`,
        });
      }

      const charName = character.characterName;
      await RPGCharacter.deleteOne({ userId: sender });

      const deleteText = `
💀 **CHARAKTER GELÖSCHT**\n\n${charName} wurde gelöscht.\n\nDu kannst dir einen neuen mit ${prefix}createchar erstellen! 🆕
      `;

      return await sock.sendMessage(from, {
        text: deleteText,
      });
    } catch (error) {
      logger.error(`Fehler in deletechar command: ${error.message}`);
    }
  },
};
