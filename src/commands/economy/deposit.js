const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'deposit',
  aliases: ['dep'],
  description: 'Zahle Geld auf dein Bankkonto ein',
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
          text: `❌ Verwendung: ${prefix}deposit [Betrag]\n\nBeispiel: ${prefix}deposit 1000`,
        });
      }

      const amount = parseInt(args[0]);

      if (isNaN(amount) || amount <= 0) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiger Betrag!`,
        });
      }

      if (amount > user.wallet) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast nicht genug Guthaben! (Wallet: $${user.wallet})`,
        });
      }

      user.wallet -= amount;
      user.bank += amount;
      await user.save();

      const depositText = `
✅ Einzahlung erfolgreich!

💰 Eingezahlt: $${amount}

👛 Wallet: $${user.wallet}
🏦 Bank: $${user.bank}
      `;

      return await sock.sendMessage(from, {
        text: depositText,
      });
    } catch (error) {
      logger.error(`Fehler in deposit command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
