const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'heal',
  aliases: ['rest', 'healen'],
  description: 'Heile deinen Charakter',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const character = await RPGCharacter.findOne({ userId: sender });

      if (!character) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter!`,
        });
      }

      if (character.health === character.maxHealth) {
        return await sock.sendMessage(from, {
          text: `✅ Du bist bereits vollständig geheilt!`,
        });
      }

      const healAmount = Math.floor(character.maxHealth * 0.3);
      character.health = Math.min(character.health + healAmount, character.maxHealth);
      await character.save();

      const healText = `
🏥 **HEILUNG**\n\n💚 +${healAmount} Health\n\n❤️ Neue Health: ${character.health}/${character.maxHealth}\n\nDu bist wieder bereit zu kämpfen! ⚔️
      `;

      return await sock.sendMessage(from, {
        text: healText,
      });
    } catch (error) {
      logger.error(`Fehler in heal command: ${error.message}`);
    }
  },
};
