const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'profile',
  aliases: ['me', 'profil'],
  description: 'Zeige dein Profil',
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

      const age = calculateAge(new Date(user.birthday));

      const profileText = `
╔════════════════════════════════════╗
║     👤 PROFIL - ${user.username}
╠════════════════════════════════════╣
║
║ 📝 **Persönliche Infos:**
║ Alter: ${age} Jahre
║ Geschlecht: ${user.gender || 'nicht gesetzt'}
║ Sexualität: ${user.sexuality || 'nicht gesetzt'}
║ Stimmung: ${user.mood || 'nicht gesetzt'}
║ Beziehungsstatus: ${user.relationshipStatus}
║
║ 🎮 **Spiel-Infos:**
║ Level: ${user.level}
║ XP: ${user.xp}
║ Liga: ${user.league} ${user.leagueTier}
║
║ 💰 **Economy:**
║ Wallet: $${user.wallet}
║ Bank: $${user.bank}
║
║ 📍 **Standort:**
║ Land: ${user.country || 'nicht gesetzt'}
║ Region: ${user.region || 'nicht gesetzt'}
║ Stadt: ${user.city || 'nicht gesetzt'}
║
║ ❤️ **Beziehungen:**
║ Freunde: ${user.friends.length}
║ Verheiratet mit: ${user.marriedTo || 'niemand'}
║ Reputation: ${user.reputation.length} Bewertungen
║
╚════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: profileText,
      });
    } catch (error) {
      logger.error(`Fehler in profile command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
