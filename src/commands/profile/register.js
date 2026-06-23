const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'register',
  aliases: ['reg'],
  description: 'Registriere dich beim Bot',
  category: 'profile',
  
  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;
      const isGroup = from?.endsWith('@g.us');
      
      // Nur im DM erlaubt
      if (isGroup) {
        return await sock.sendMessage(from, {
          text: `❌ Registrierung ist nur in privaten Nachrichten möglich!`,
        });
      }
      
      // Check Argumente
      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `❌ Verwendung: ${prefix}register [benutzername] [tt.mm.jjjj]\n\nBeispiel: ${prefix}register MeinName 15.05.2005`,
        });
      }
      
      const username = args[0];
      const birthdayStr = args[1];
      
      // Username validieren
      if (username.length < 3 || username.length > 20) {
        return await sock.sendMessage(from, {
          text: `❌ Username muss zwischen 3 und 20 Zeichen lang sein!`,
        });
      }
      
      // Datum validieren
      const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      if (!dateRegex.test(birthdayStr)) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiges Datumsformat! Nutze: tt.mm.jjjj`,
        });
      }
      
      const [day, month, year] = birthdayStr.split('.').map(Number);
      const birthday = new Date(year, month - 1, day);
      
      // Check ob User bereits existiert
      const existingPhoneUser = await User.findOne({ phoneNumber: sender });
      if (existingPhoneUser) {
        return await sock.sendMessage(from, {
          text: `❌ Diese Nummer ist bereits registriert!`,
        });
      }
      
      const existingUsernameUser = await User.findOne({ username });
      if (existingUsernameUser) {
        return await sock.sendMessage(from, {
          text: `❌ Username "${username}" existiert bereits!`,
        });
      }
      
      // Neuen User erstellen
      const newUser = new User({
        phoneNumber: sender,
        username,
        birthday,
        gdprAccepted: true,
        gdprAcceptedDate: new Date(),
        termsAccepted: true,
        termsAcceptedDate: new Date(),
        isLoggedIn: true,
      });
      
      await newUser.save();
      
      logger.success(`✅ Neuer User registriert: ${username} (${sender})`);
      
      return await sock.sendMessage(from, {
        text: `✅ Registrierung erfolgreich!\n\n👤 Username: ${username}\n🎂 Geburtstag: ${birthdayStr}\n\nWillkommen bei ${sock.user.name || 'KingBot'}! 🎉\n\nNutze ${prefix}help für eine Übersicht der Befehle!`,
      });
    } catch (error) {
      logger.error(`Fehler in register command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
