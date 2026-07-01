const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'thanks',
  aliases: ['danke', 'thankpoint'],
  description: 'Gebe jemandem einen Danke-Punkt',
  category: 'community',

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
          text: `🙋 Danke jemandem!\n\nBeispiel: ${prefix}thanks username`,
        });
      }

      const targetName = args[0];
      const target = await User.findOne({ username: targetName });

      if (!target) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${targetName}" nicht gefunden!`,
        });
      }

      if (target.phoneNumber === sender) {
        return await sock.sendMessage(from, {
          text: `🤣 Du kannst dich nicht selbst danken!`,
        });
      }

      target.thankPoints += 1;
      await target.save();

      const thanksText = `
🙋 Danke gegeben!\n\n${targetName} hat jetzt ${target.thankPoints} Danke-Punkte! ❤️
      `;

      return await sock.sendMessage(from, {
        text: thanksText,
      });
    } catch (error) {
      logger.error(`Fehler in thanks command: ${error.message}`);
    }
  },
};
