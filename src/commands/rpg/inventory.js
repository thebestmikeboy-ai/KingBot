const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'inventory',
  aliases: ['inv', 'items'],
  description: 'Zeige dein Inventar',
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

      if (character.inventory.length === 0) {
        return await sock.sendMessage(from, {
          text: `📦 Dein Inventar ist leer!\n\nJage Monster oder kaufe Items!`,
        });
      }

      let inventoryText = `
📦 **INVENTAR** - ${character.characterName}\n\n`;

      character.inventory.forEach((item, index) => {
        inventoryText += `${index + 1}. ${item.itemId} x${item.quantity}\n`;
      });

      inventoryText += `\n🎒 Slots: ${character.inventory.length}/20`;

      return await sock.sendMessage(from, {
        text: inventoryText,
      });
    } catch (error) {
      logger.error(`Fehler in inventory command: ${error.message}`);
    }
  },
};
