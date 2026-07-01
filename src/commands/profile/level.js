const User = require('../../models/User');
const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'level',
  aliases: ['lvl', 'mylevel'],
  description: 'Zeige dein Level & XP',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      const xpPerLevel = 1000;
      const currentXP = user.xp % xpPerLevel;
      const xpPercentage = Math.floor((currentXP / xpPerLevel) * 100);
      const xpBar = '▏'.repeat(Math.floor(xpPercentage / 10)) + '░'.repeat(10 - Math.floor(xpPercentage / 10));

      const levelText = `
╔═══════════════════════════════════════╗
║  🎯 LEVEL & XP - ${user.username.padEnd(20)}║
╠═══════════════════════════════════════╣
║                                        ║
║ 🎯 Level: ${String(user.level).padEnd(32)}║
║ ⭐ Gesamt XP: ${String(user.xp).padEnd(30)}║
║                                        ║
║ XP zum nächsten Level: ${currentXP}/${xpPerLevel}       ║
║ ${xpBar} ${xpPercentage}%             ║
║                                        ║
╚═══════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: levelText,
      });
    } catch (error) {
      logger.error(`Fehler in level command: ${error.message}`);
    }
  },
};
