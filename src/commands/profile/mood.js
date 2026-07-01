const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'mood',
  aliases: ['setmood', 'stimmung'],
  description: 'Setze deine Stimmung',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `😍 Setze deine Stimmung!\n\n${prefix}mood [text]\n\nBeispiel: ${prefix}mood Glücklich & motiviert!`,
        });
      }

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      const mood = args.join(' ').substring(0, 50);
      user.mood = mood;
      await user.save();

      const moodText = `
✅ Stimmung aktualisiert!\n\n😍 Stimmung: ${mood}
      `;

      return await sock.sendMessage(from, {
        text: moodText,
      });
    } catch (error) {
      logger.error(`Fehler in mood command: ${error.message}`);
    }
  },
};
