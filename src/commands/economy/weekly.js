const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'weekly',
  aliases: [],
  description: 'Hole deine wöchentliche Belohnung',
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
      const lastClaim = user.weeklyLastClaimed ? new Date(user.weeklyLastClaimed) : null;

      // Check ob schon diese Woche geclaimed
      if (lastClaim && isThisWeek(lastClaim)) {
        const nextClaim = new Date(lastClaim);
        nextClaim.setDate(nextClaim.getDate() + 7);
        const timeLeft = formatTimeLeft(nextClaim);

        return await sock.sendMessage(from, {
          text: `⏰ Du kannst erst in ${timeLeft} wieder claimen!`,
        });
      }

      // Reward geben
      const weeklyReward = 2500;
      user.wallet += weeklyReward;
      user.weeklyLastClaimed = now;
      await user.save();

      const weeklyText = `
✅ Wöchentliche Belohnung erhalten!

💰 +$${weeklyReward}
👛 Neuer Kontostand: $${user.wallet}

🎯 Nächste Woche geht's wieder los! 💪
      `;

      return await sock.sendMessage(from, {
        text: weeklyText,
      });
    } catch (error) {
      logger.error(`Fehler in weekly command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};

function isThisWeek(date) {
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 7;
}

function formatTimeLeft(date) {
  const now = new Date();
  const diff = date - now;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}d ${hours}h`;
}
