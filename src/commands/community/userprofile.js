const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'profile',
  aliases: ['userprofile', 'userinfo'],
  description: 'Zeige das Profil eines Benutzers',
  category: 'community',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `👤 Gib einen Benutzernamen an!\n\nBeispiel: ${prefix}userprofile username`,
        });
      }

      const username = args[0];
      const user = await User.findOne({ username });

      if (!user) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${username}" nicht gefunden!`,
        });
      }

      const avgRating = user.ratings.length > 0 
        ? (user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length).toFixed(1)
        : 'N/A';

      const profileText = `
╔════════════════════════════════════════╗
║  👤 PROFIL - ${username.padEnd(25)}║
╠════════════════════════════════════════╣
║                                        ║
║ 🎯 Level: ${String(user.level).padEnd(32)}║
║ ⭐ XP: ${String(user.xp).padEnd(37)}║
║ 🏅 Liga: ${String(user.league + ' ' + user.leagueTier).padEnd(33)}║
║                                        ║
║ 💰 Verhältnis: ${String(user.relationshipStatus).padEnd(30)}║
║ 💫 Verhält mit: ${String(user.marriedTo || 'Keiner').padEnd(26)}║
║                                        ║
║ 👥 Freunde: ${String(user.friends.length).padEnd(32)}║
║ 📢 Bewertungen: ${String(user.reputation.length).padEnd(28)}║
║ ⭐ Durchschnitt: ${String(avgRating).padEnd(28)}║
║ 👏 Danke-Punkte: ${String(user.thankPoints).padEnd(26)}║
║                                        ║
║ 📋 Bio:                                 ║
║ ${(user.bio || 'Keine Bio gesetzt').substring(0, 37).padEnd(37)}║
║                                        ║
╚════════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: profileText,
      });
    } catch (error) {
      logger.error(`Fehler in userprofile command: ${error.message}`);
    }
  },
};
