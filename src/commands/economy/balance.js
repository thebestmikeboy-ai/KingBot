const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'bank'],
  description: 'Zeige dein Guthaben',
  category: 'economy',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const user = await User.findOne({ phoneNumber: sender });

      if (!user) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert! Nutze ${prefix}register`,
        });
      }

      const walletBar = createBar(user.wallet, 10000, 20);
      const bankBar = createBar(user.bank, 50000, 20);

      const balanceText = `
╔════════════════════════════════════╗
║     💰 DEIN GUTHABEN - ${user.username}
╠════════════════════════════════════╣
║
║ 👛 Wallet: $${user.wallet}
║ ${walletBar}
║
║ 🏦 Bank: $${user.bank}
║ ${bankBar}
║
║ 💵 Gesamt: $${user.wallet + user.bank}
║
╚════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: balanceText,
      });
    } catch (error) {
      logger.error(`Fehler in balance command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};

function createBar(current, max, length) {
  const filled = Math.floor((current / max) * length);
  const empty = length - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${current}/${max}`;
}
