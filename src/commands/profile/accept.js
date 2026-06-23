const User = require('../../models/User');

module.exports = {
  name: 'accept',
  aliases: [],
  description: 'Akzeptiere die Nutzungsrichtlinien',
  category: 'profile',
  
  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;
      const isGroup = from?.endsWith('@g.us');
      
      if (isGroup) {
        return await sock.sendMessage(from, {
          text: `❌ Dies funktioniert nur im Privatchat!`,
        });
      }
      
      // Check ob schon akzeptiert
      const user = await User.findOne({ phoneNumber: sender });
      if (user && user.termsAccepted) {
        return await sock.sendMessage(from, {
          text: `✅ Du hast die Richtlinien bereits akzeptiert!\n\nNutze ${prefix}register um dich anzumelden.`,
        });
      }
      
      // User aktualisieren oder erstellen
      if (user) {
        user.termsAccepted = true;
        user.termsAcceptedDate = new Date();
        await user.save();
      } else {
        const newUser = new User({
          phoneNumber: sender,
          termsAccepted: true,
          termsAcceptedDate: new Date(),
          gdprAccepted: true,
          gdprAcceptedDate: new Date(),
        });
        await newUser.save();
      }
      
      return await sock.sendMessage(from, {
        text: `✅ Danke! Du hast die Richtlinien akzeptiert.\n\nJetzt kannst du dich mit ${prefix}register anmelden!`,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
