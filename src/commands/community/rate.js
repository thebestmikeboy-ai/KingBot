const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'rate',
  aliases: ['rating', 'giverating'],
  description: 'Bewerte einen Benutzer mit Sternen',
  category: 'community',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `⭐ Bewerte einen Benutzer!\n\nBeispiel: ${prefix}rate username 5\n\nSkala: 1-5 Sterne`,
        });
      }

      const targetName = args[0];
      const rating = parseInt(args[1]);

      if (isNaN(rating) || rating < 1 || rating > 5) {
        return await sock.sendMessage(from, {
          text: `❌ Rating muss zwischen 1 und 5 liegen!`,
        });
      }

      const target = await User.findOne({ username: targetName });

      if (!target) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${targetName}" nicht gefunden!`,
        });
      }

      target.ratings.push({
        fromUser: sender,
        rating: rating,
        date: new Date(),
      });

      await target.save();

      const avgRating = (target.ratings.reduce((sum, r) => sum + r.rating, 0) / target.ratings.length).toFixed(1);
      const stars = '⭐'.repeat(rating);

      const rateComplete = `
✅ Bewertung hinzugefügt!\n\n${stars} (${rating}/5)\n\n${targetName}'s Durchschnitt: ${avgRating}⭐ (${target.ratings.length} Bewertungen)
      `;

      return await sock.sendMessage(from, {
        text: rateComplete,
      });
    } catch (error) {
      logger.error(`Fehler in rate command: ${error.message}`);
    }
  },
};
