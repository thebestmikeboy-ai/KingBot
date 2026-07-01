const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'support',
  aliases: ['ticket', 'help'],
  description: 'Erstelle ein Support-Ticket',
  category: 'community',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `🊨 Erstelle ein Support-Ticket!\n\nBeispiel: ${prefix}support bug Ich habe einen Bug gefunden!\n\nKategorien: bug, suggestion, support, other`,
        });
      }

      const category = args[0].toLowerCase();
      const ticketMessage = args.slice(1).join(' ');

      if (!['bug', 'suggestion', 'support', 'other'].includes(category)) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültige Kategorie! Verfügbar: bug, suggestion, support, other`,
        });
      }

      const Support = require('../../models/Support');
      const ticket = new Support({
        ticketId: `ticket-${Date.now()}`,
        userId: sender,
        message: ticketMessage,
        category,
      });

      await ticket.save();

      const ticketText = `
✅ Support-Ticket erstellt!\n\n🊨 Ticket-ID: ${ticket.ticketId}\n📝 Kategorie: ${category}\n💚 Status: ${ticket.status}\n\nWir werden uns schnellstmöglich um dein Anliegen kümmern! 🙋
      `;

      return await sock.sendMessage(from, {
        text: ticketText,
      });
    } catch (error) {
      logger.error(`Fehler in support command: ${error.message}`);
    }
  },
};
