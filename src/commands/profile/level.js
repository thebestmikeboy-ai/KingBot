const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'level',
  aliases: ['lvl', 'rank'],
  description: 'Zeige dein Level und XP',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const user = await User.findOne({ phoneNumber: sender });

      if (!user) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      // XP zum nächsten Level berechnen (vereinfacht: 100 XP pro Level)
      const xpPerLevel = 100;
      const currentLevelXp = user.xp % xpPerLevel;
      const xpProgress = (currentLevelXp / xpPerLevel) * 100;
      const xpBar = createBar(currentLevelXp, xpPerLevel, 20);

      const levelText = `
╔════════════════════════════════════╗
║  📊 LEVEL & XP - ${user.username}
╠════════════════════════════════════╣
║
║ 🎯 Level: ${user.level}
║ 🏅 Liga: ${user.league} ${user.leagueTier}
║
║ ⭐ XP: ${user.xp} / ${xpPerLevel * user.level}
║ ${xpBar}
║ ${xpProgress.toFixed(1)}%
║
║ 📈 XP zum nächsten Level: ${xpPerLevel - currentLevelXp}
║
╚════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: levelText,
      });
    } catch (error) {
      logger.error(`Fehler in level command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};

function createBar(current, max, length) {
  const filled = Math.floor((current / max) * length);
  const empty = length - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}
