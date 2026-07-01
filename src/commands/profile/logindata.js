const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'logindata',
  aliases: ['mylogin', 'credentials'],
  description: 'Zeige deine Logindaten',
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

      const loginText = `
🔐 **DEINE LOGINDATEN**\n\n👤 Username: ${user.username}\n🔐 Passwort: ${user.passwordSet ? '✅ Gesetzt' : '❌ Nicht gesetzt'}\n💳 Status: ${user.loggedIn ? '✅ Angemeldet' : '❌ Abgemeldet'}\n\nLogin mit: ${prefix}login ${user.username} [passwort]
      `;

      return await sock.sendMessage(from, {
        text: loginText,
      });
    } catch (error) {
      logger.error(`Fehler in logindata command: ${error.message}`);
    }
  },
};
