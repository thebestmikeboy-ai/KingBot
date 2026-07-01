const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'dsgvo',
  aliases: ['gdpr', 'datenschutz'],
  description: 'Zeige DSGVO Richtlinien',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      const isGroup = from?.endsWith('@g.us');

      if (isGroup) {
        return await sock.sendMessage(from, {
          text: `❌ DSGVO muss im Bot-Privatchat akzeptiert werden!`,
        });
      }

      const dsgvoText = `
📄 **DATENSCHUTZERKLÄRUNG (DSGVO)**

Wir speichern folgende Daten:
• Telefonnummer (zur Identifikation)
• Benutzername (frei wählbar)
• Geburtsdatum (optional)
• Spielstatistiken (Level, XP, Geld)
• Freundesliste & Beziehungen
• Charakter-Daten (RPG)

Deine Daten sind sicher und werden nicht an Dritte weitergegeben.

Du kannst deine Daten jederzeit mit ${prefix}forgetme löschen!

Akzeptierst du? ${prefix}accept
      `;

      return await sock.sendMessage(from, {
        text: dsgvoText,
      });
    } catch (error) {
      logger.error(`Fehler in dsgvo command: ${error.message}`);
    }
  },
};
