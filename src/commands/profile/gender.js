const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'gender',
  aliases: ['setgender', 'geschlecht'],
  description: 'Setze dein Geschlecht',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `♂️ Setze dein Geschlecht!\n\n${prefix}gender [text]\n\nBeispiel: ${prefix}gender Männlich`,
        });
      }

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      const gender = args.join(' ');
      user.gender = gender;
      await user.save();

      const genderText = `
✅ Geschlecht aktualisiert!\n\n♂️ Geschlecht: ${gender}
      `;

      return await sock.sendMessage(from, {
        text: genderText,
      });
    } catch (error) {
      logger.error(`Fehler in gender command: ${error.message}`);
    }
  },
};
