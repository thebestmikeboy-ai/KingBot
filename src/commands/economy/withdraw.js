const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'withdraw',
  aliases: ['with'],
  description: 'Hebe Geld von deinem Bankkonto ab',
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

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ Verwendung: ${prefix}withdraw [Betrag]\n\nBeispiel: ${prefix}withdraw 500`,
        });
      }

      const amount = parseInt(args[0]);

      if (isNaN(amount) || amount <= 0) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiger Betrag!`,
        });
      }

      if (amount > user.bank) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast nicht genug auf der Bank! (Bank: $${user.bank})`,
        });
      }

      user.bank -= amount;
      user.wallet += amount;
      await user.save();

      const withdrawText = `
✅ Auszahlung erfolgreich!

💰 Ausgezahlt: $${amount}

👛 Wallet: $${user.wallet}
🏦 Bank: $${user.bank}
      `;

      return await sock.sendMessage(from, {
        text: withdrawText,
      });
    } catch (error) {
      logger.error(`Fehler in withdraw command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
