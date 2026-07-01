const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'mydata',
  aliases: ['meine_daten', 'userdata'],
  description: 'Zeige alle deine gespeicherten Daten',
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

      const dataText = `
📄 **DEINE GESPEICHERTEN DATEN**\n\n💳 **Persönlich:**\nUsername: ${user.username}\nTelefon: ${user.phoneNumber}\nGeburtsdatum: ${user.birthDate ? new Date(user.birthDate).toLocaleDateString('de-DE') : 'Keine Angabe'}\nRegistriert: ${new Date(user.registeredDate).toLocaleDateString('de-DE')}\n\n👤 **Profil:**\nGeschlecht: ${user.gender || 'Keine Angabe'}\nSexualität: ${user.sexuality || 'Keine Angabe'}\nStimmung: ${user.mood || 'Keine Angabe'}\nBeziehung: ${user.relationshipStatus || 'Single'}\nVerhält mit: ${user.marriedTo || 'Niemand'}\n\n🎯 **Spielstand:**\nLevel: ${user.level}\nXP: ${user.xp}\nLiga: ${user.league} ${user.leagueTier}\nWallet: \$${user.wallet}\nBank: \$${user.bank}\n\nMöchtest du deine Daten löschen? ${prefix}forgetme confirm confirm
      `;

      return await sock.sendMessage(from, {
        text: dataText,
      });
    } catch (error) {
      logger.error(`Fehler in mydata command: ${error.message}`);
    }
  },
};
