const User = require('../../models/User');
const logger = require('../../utils/logger');
const bcrypt = require('bcrypt');

module.exports = {
  name: 'password',
  aliases: ['setpassword', 'pwd'],
  description: 'Setze dein Accountpasswort',
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

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `🔐 Setze dein Passwort!\n\n${prefix}password [neues passwort]\n\nMinimum 6 Zeichen!`,
        });
      }

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      const password = args.join(' ');

      if (password.length < 6) {
        return await sock.sendMessage(from, {
          text: `❌ Passwort muss mindestens 6 Zeichen lang sein!`,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.passwordSet = true;
      await user.save();

      const passwordText = `
✅ Passwort gesetzt!\n\n🔐 Dein Passwort ist jetzt gespeichert.\n\nNutze es zum Login: ${prefix}login ${user.username} [passwort]
      `;

      return await sock.sendMessage(from, {
        text: passwordText,
      });
    } catch (error) {
      logger.error(`Fehler in password command: ${error.message}`);
    }
  },
};
