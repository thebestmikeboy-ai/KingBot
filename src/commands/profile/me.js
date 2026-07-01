const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'me',
  aliases: ['myprofile', 'myprofil'],
  description: 'Zeige dein Profil',
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

      const avgRating = user.ratings.length > 0 
        ? (user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length).toFixed(1)
        : 'N/A';

      const profileText = `
╔═══════════════════════════════════════╗
║  👤 MEIN PROFIL - ${user.username.padEnd(22)}║
╠═══════════════════════════════════════╣
║                                        ║
║ 🎯 Level: ${String(user.level).padEnd(32)}║
║ ⭐ XP: ${String(user.xp).padEnd(37)}║
║ 🏅 Liga: ${String(user.league + ' ' + user.leagueTier).padEnd(33)}║
║                                        ║
║ 💰 Wallet: $${String(user.wallet).padEnd(31)}║
║ 💳 Bank: $${String(user.bank).padEnd(33)}║
║                                        ║
║ ♂️ Geschlecht: ${String(user.gender || 'Keine Angabe').substring(0, 27).padEnd(27)}║
║ ♥️ Sexualität: ${String(user.sexuality || 'Keine Angabe').substring(0, 25).padEnd(25)}║
║ 😍 Stimmung: ${String(user.mood || 'Neutral').substring(0, 29).padEnd(29)}║
║ 💫 Beziehung: ${String(user.relationshipStatus || 'Single').substring(0, 27).padEnd(27)}║
║                                        ║
║ 👥 Freunde: ${String(user.friends.length).padEnd(32)}║
║ ⭐ Bewertung: ${String(avgRating).padEnd(31)}║
║ 👏 Danke-Punkte: ${String(user.thankPoints).padEnd(26)}║
║                                        ║
║ 🌟 Aura: ${String(user.currentAura?.color || 'Keine').substring(0, 32).padEnd(32)}║
║                                        ║
╚═══════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: profileText,
      });
    } catch (error) {
      logger.error(`Fehler in me command: ${error.message}`);
    }
  },
};
