const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'richest',
  aliases: ['toprich', 'topmoney'],
  description: 'Zeige die Top 10 reichsten User',
  category: 'economy',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;

      const richestUsers = await User.find()
        .sort({ totalMoney: -1 })
        .limit(10)
        .select('username wallet bank totalMoney');

      if (richestUsers.length === 0) {
        return await sock.sendMessage(from, {
          text: `💰 Noch keine Benutzer registriert!`,
        });
      }

      // Berechne totalMoney für jede Person
      richestUsers.forEach(user => {
        user.totalMoney = user.wallet + user.bank;
      });

      // Sortiere nach totalMoney
      richestUsers.sort((a, b) => b.totalMoney - a.totalMoney);

      let richestText = `
╔════════════════════════════════════╗
║    💰 TOP 10 REICHSTE USER
╠════════════════════════════════════╣
║
`;

      richestUsers.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        richestText += `║ ${medal} ${user.username}\n`;
        richestText += `║    💵 $${user.totalMoney}\n`;
        richestText += `║    👛 $${user.wallet} | 🏦 $${user.bank}\n`;
        richestText += `║\n`;
      });

      richestText += `╚════════════════════════════════════╝`;

      return await sock.sendMessage(from, {
        text: richestText,
      });
    } catch (error) {
      logger.error(`Fehler in richest command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
