const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'sexuality',
  aliases: ['setsexuality', 'sexualitaet'],
  description: 'Setze deine Sexualität',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `♥️ Setze deine Sexualität!\n\n${prefix}sexuality [text]\n\nBeispiel: ${prefix}sexuality Heterosexuell`,
        });
      }

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      const sexuality = args.join(' ');
      user.sexuality = sexuality;
      await user.save();

      const sexualityText = `
✅ Sexualität aktualisiert!\n\n♥️ Sexualität: ${sexuality}
      `;

      return await sock.sendMessage(from, {
        text: sexualityText,
      });
    } catch (error) {
      logger.error(`Fehler in sexuality command: ${error.message}`);
    }
  },
};
