const User = require('../../models/User');
const logger = require('../../utils/logger');
const bcrypt = require('bcrypt');

module.exports = {
  name: 'logout',
  aliases: ['abmelden', 'signout'],
  description: 'Melde dich ab',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;
      const isGroup = from?.endsWith('@g.us');

      if (isGroup) {
        return await sock.sendMessage(from, {
          text: `❌ Dies muss im Bot-Privatchat erfolgen!`,
        });
      }

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      user.loggedIn = false;
      await user.save();

      const logoutText = `
🚪 Du wurdest abgemeldet!\n\nWillkommen zurück mit: ${prefix}login ${user.username} [passwort]
      `;

      return await sock.sendMessage(from, {
        text: logoutText,
      });
    } catch (error) {
      logger.error(`Fehler in logout command: ${error.message}`);
    }
  },
};
