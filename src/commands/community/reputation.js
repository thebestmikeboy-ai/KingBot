const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'reputation',
  aliases: ['rep', 'raterep'],
  description: 'Bewerte einen Benutzer',
  category: 'community',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `🔍 Bewerte einen Benutzer!\n\nBeispiel: ${prefix}reputation username Sehr nett und hilfsbereit!\n\nFormat: ${prefix}reputation [username] [text...]`,
        });
      }

      const targetName = args[0];
      const repText = args.slice(1).join(' ');

      const target = await User.findOne({ username: targetName });

      if (!target) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${targetName}" nicht gefunden!`,
        });
      }

      target.reputation.push({
        fromUser: sender,
        text: repText,
        date: new Date(),
      });

      await target.save();

      const repComplete = `
✅ Bewertung hinzugefügt!\n\n📢 "${repText}"\n\n${targetName} hat jetzt ${target.reputation.length} Bewertungen!
      `;

      return await sock.sendMessage(from, {
        text: repComplete,
      });
    } catch (error) {
      logger.error(`Fehler in reputation command: ${error.message}`);
    }
  },
};
