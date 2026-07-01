const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'whois',
  aliases: ['userprofile', 'profile'],
  description: 'Zeige das Profil eines Users',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;

      // Versuche @mention zu extrahieren
      const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      
      if (!mentionedJid && args.length === 0) {
        return await sock.sendMessage(from, {
          text: `👤 Markiere einen User oder gib Username an!\n\n${prefix}whois @user`,
        });
      }

      let targetUser;

      if (mentionedJid) {
        targetUser = await User.findOne({ phoneNumber: mentionedJid });
      } else {
        targetUser = await User.findOne({ username: args[0] });
      }

      if (!targetUser) {
        return await sock.sendMessage(from, {
          text: `❌ User nicht gefunden!`,
        });
      }

      const avgRating = targetUser.ratings.length > 0 
        ? (targetUser.ratings.reduce((sum, r) => sum + r.rating, 0) / targetUser.ratings.length).toFixed(1)
        : 'N/A';

      const profileText = `
╔═══════════════════════════════════════╗
║  👤 ${targetUser.username.padEnd(35)}║
╠═══════════════════════════════════════╣
║                                        ║
║ 🎯 Level: ${String(targetUser.level).padEnd(32)}║
║ ⭐ XP: ${String(targetUser.xp).padEnd(37)}║
║ 🏅 Liga: ${String(targetUser.league + ' ' + targetUser.leagueTier).padEnd(33)}║
║                                        ║
║ ♂️ Geschlecht: ${String(targetUser.gender || 'Keine Angabe').substring(0, 27).padEnd(27)}║
║ ♥️ Sexualität: ${String(targetUser.sexuality || 'Keine Angabe').substring(0, 25).padEnd(25)}║
║ 😍 Stimmung: ${String(targetUser.mood || 'Neutral').substring(0, 29).padEnd(29)}║
║ 💫 Beziehung: ${String(targetUser.relationshipStatus || 'Single').substring(0, 27).padEnd(27)}║
║                                        ║
║ 👥 Freunde: ${String(targetUser.friends.length).padEnd(32)}║
║ ⭐ Bewertung: ${String(avgRating).padEnd(31)}║
║ 👏 Danke-Punkte: ${String(targetUser.thankPoints).padEnd(26)}║
║                                        ║
║ 🌟 Aura: ${String(targetUser.currentAura?.color || 'Keine').substring(0, 32).padEnd(32)}║
║                                        ║
╚═══════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: profileText,
      });
    } catch (error) {
      logger.error(`Fehler in whois command: ${error.message}`);
    }
  },
};
