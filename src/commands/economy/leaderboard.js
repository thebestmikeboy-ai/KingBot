const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb', 'top'],
  description: 'Zeige die Top 10 nach Level & XP',
  category: 'economy',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;

      const topUsers = await User.find()
        .sort({ level: -1, xp: -1 })
        .limit(10)
        .select('username level xp league leagueTier');

      if (topUsers.length === 0) {
        return await sock.sendMessage(from, {
          text: `📊 Noch keine Benutzer registriert!`,
        });
      }

      let leaderboardText = `
╔════════════════════════════════════╗
║        🏆 TOP 10 LEADERBOARD
╠════════════════════════════════════╣
║
`;

      topUsers.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        leaderboardText += `║ ${medal} ${user.username} | Lvl ${user.level} | XP ${user.xp}\n`;
        leaderboardText += `║    ${user.league} ${user.leagueTier}\n`;
        leaderboardText += `║\n`;
      });

      leaderboardText += `╚════════════════════════════════════╝`;

      return await sock.sendMessage(from, {
        text: leaderboardText,
      });
    } catch (error) {
      logger.error(`Fehler in leaderboard command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
