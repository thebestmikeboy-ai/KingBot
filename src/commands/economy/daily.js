const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'daily',
  aliases: [],
  description: 'Hole deine tägliche Belohnung',
  category: 'economy',

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

      const now = new Date();
      const lastClaim = user.dailyLastClaimed ? new Date(user.dailyLastClaimed) : null;

      // Check ob schon heute geclaimed
      if (lastClaim && isToday(lastClaim)) {
        const nextClaim = new Date(lastClaim);
        nextClaim.setDate(nextClaim.getDate() + 1);
        const timeLeft = formatTimeLeft(nextClaim);

        return await sock.sendMessage(from, {
          text: `⏰ Du kannst erst in ${timeLeft} wieder claimen!`,
        });
      }

      // Reward geben
      const dailyReward = 500;
      user.wallet += dailyReward;
      user.dailyLastClaimed = now;
      await user.save();

      const dailyText = `
✅ Tägliche Belohnung erhalten!

💰 +$${dailyReward}
👛 Neuer Kontostand: $${user.wallet}

🎯 Komm morgen wieder für mehr! ✨
      `;

      return await sock.sendMessage(from, {
        text: dailyText,
      });
    } catch (error) {
      logger.error(`Fehler in daily command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatTimeLeft(date) {
  const now = new Date();
  const diff = date - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
