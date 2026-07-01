const User = require('../../models/User');
const logger = require('../../utils/logger');
const bcrypt = require('bcrypt');

module.exports = {
  name: 'login',
  aliases: ['signin', 'anmelden'],
  description: 'Melde dich an',
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

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `🚪 Login!\n\nBeispiel: ${prefix}login [username] [passwort]`,
        });
      }

      const username = args[0];
      const password = args.slice(1).join(' ');

      const user = await User.findOne({ username });

      if (!user) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${username}" nicht gefunden!`,
        });
      }

      if (user.phoneNumber !== sender) {
        return await sock.sendMessage(from, {
          text: `❌ Dieser Account gehört dir nicht!`,
        });
      }

      if (!user.passwordSet) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast kein Passwort gesetzt!\n\nSetze eins mit ${prefix}password`,
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return await sock.sendMessage(from, {
          text: `❌ Falsches Passwort!`,
        });
      }

      user.loggedIn = true;
      user.lastLogin = new Date();
      await user.save();

      const loginText = `
✅ **ERFOLGREICH ANGEMELDET!**\n\n👤 Username: ${username}\n🎯 Level: ${user.level}\n⭐ XP: ${user.xp}\n\nWillkommen zurück! 🌟
      `;

      return await sock.sendMessage(from, {
        text: loginText,
      });
    } catch (error) {
      logger.error(`Fehler in login command: ${error.message}`);
    }
  },
};
