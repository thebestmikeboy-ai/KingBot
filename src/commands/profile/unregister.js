const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'unregister',
  aliases: ['unregistrieren', 'forgetme'],
  description: 'Lösche deinen Account',
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

      if (args.length < 2 || args[0]?.toLowerCase() !== 'confirm' || args[1]?.toLowerCase() !== 'confirm') {
        return await sock.sendMessage(from, {
          text: `⚠️ WARNUNG: Dies löscht deinen Account PERMANENT!\n\nAlle Daten werden gelöscht!\n\nBestätige mit: ${prefix}unregister confirm confirm`,
        });
      }

      const user = await User.findOne({ phoneNumber: sender });

      if (!user) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Account!`,
        });
      }

      const username = user.username;
      await User.deleteOne({ phoneNumber: sender });

      const deleteText = `
💀 **ACCOUNT GELÖSCHT**\n\nDein Account "${username}" wurde permanent gelöscht.\n\nAuf Wiedersehen! 👋
      `;

      return await sock.sendMessage(from, {
        text: deleteText,
      });
    } catch (error) {
      logger.error(`Fehler in unregister command: ${error.message}`);
    }
  },
};
