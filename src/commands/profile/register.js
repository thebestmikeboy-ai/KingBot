const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'register',
  aliases: ['reg', 'signup'],
  description: 'Registriere dich beim Bot',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;
      const isGroup = from?.endsWith('@g.us');

      if (isGroup) {
        return await sock.sendMessage(from, {
          text: `❌ Registrierung muss im Bot-Privatchat erfolgen!`,
        });
      }

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `📝 Registriere dich!\n\nBeispiel: ${prefix}register [username] [tt.mm.jjjj]\n\n${prefix}register Max 15.03.1990`,
        });
      }

      const username = args[0];
      const birthDateStr = args[1];

      // Validiere Datum
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
      if (!dateRegex.test(birthDateStr)) {
        return await sock.sendMessage(from, {
          text: `❌ Falsches Datumsformat! Nutze: tt.mm.jjjj (z.B. 15.03.1990)`,
        });
      }

      // Check auf existierenden User
      let user = await User.findOne({ phoneNumber: sender });

      if (user && user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist bereits registriert als "${user.username}"!`,
        });
      }

      // Check auf Username
      const usernameTaken = await User.findOne({ username });
      if (usernameTaken) {
        return await sock.sendMessage(from, {
          text: `❌ Der Username "${username}" ist bereits vergeben!`,
        });
      }

      // Erstelle User
      if (!user) {
        user = new User({ phoneNumber: sender });
      }

      user.username = username;
      user.birthDate = new Date(birthDateStr.split('.').reverse().join('-'));
      user.registered = true;
      user.registeredDate = new Date();
      user.dsgvoAccepted = true;

      await user.save();

      const registerText = `
✅ **REGISTRIERUNG ERFOLGREICH!**\n\n👤 Username: ${username}\n📅 Geburtsdatum: ${birthDateStr}\n\nWillkommen! 🎉\n\nJetzt kannst du den Bot nutzen!\n${prefix}help - für eine Übersicht
      `;

      return await sock.sendMessage(from, {
        text: registerText,
      });
    } catch (error) {
      logger.error(`Fehler in register command: ${error.message}`);
    }
  },
};
