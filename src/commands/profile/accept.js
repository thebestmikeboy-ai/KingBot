const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'accept',
  aliases: ['acceptdsgvo', 'agreerichtlinien'],
  description: 'Akzeptiere die Richtlinien',
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

      const existingUser = await User.findOne({ phoneNumber: sender });

      if (existingUser) {
        if (existingUser.dsgvoAccepted) {
          return await sock.sendMessage(from, {
            text: `✅ Du hast die Richtlinien bereits akzeptiert!\n\nRegistriere dich mit ${prefix}register [username] [tt.mm.jjjj]`,
          });
        }
      }

      // Speichere Akzeptanz
      const user = existingUser || new User({ phoneNumber: sender });
      user.dsgvoAccepted = true;
      user.dsgvoAcceptedDate = new Date();
      await user.save();

      const acceptText = `
✅ DSGVO akzeptiert!\n\nJetzt kannst du dich registrieren!\n\n${prefix}register [username] [tt.mm.jjjj]\n\nBeispiel: ${prefix}register Max 15.03.1990
      `;

      return await sock.sendMessage(from, {
        text: acceptText,
      });
    } catch (error) {
      logger.error(`Fehler in accept command: ${error.message}`);
    }
  },
};
