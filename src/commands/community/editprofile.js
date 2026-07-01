const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'editprofile',
  aliases: ['setprofile', 'updateprofile'],
  description: 'Bearbeite dein Profil',
  category: 'community',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const user = await User.findOne({ phoneNumber: sender });

      if (!user) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `📋 Bearbeite dein Profil!\n\nOptionen:\n${prefix}editprofile bio [text] - Setze Bio\n${prefix}editprofile gender [m/w/div] - Geschlecht\n${prefix}editprofile mood [text] - Stimmung\n${prefix}editprofile status [single/taken] - Status`,
        });
      }

      const field = args[0].toLowerCase();
      const value = args.slice(1).join(' ');

      if (field === 'bio') {
        user.bio = value.substring(0, 150);
      } else if (field === 'gender') {
        if (!['m', 'w', 'div'].includes(value.toLowerCase())) {
          return await sock.sendMessage(from, {
            text: `❌ Options: m, w, div`,
          });
        }
        user.gender = value;
      } else if (field === 'mood') {
        user.mood = value.substring(0, 50);
      } else if (field === 'status') {
        if (!['single', 'taken'].includes(value.toLowerCase())) {
          return await sock.sendMessage(from, {
            text: `❌ Options: single, taken`,
          });
        }
        user.relationshipStatus = value;
      } else {
        return await sock.sendMessage(from, {
          text: `❌ Unbekanntes Feld!`,
        });
      }

      await user.save();

      const updateText = `
✅ Profil aktualisiert!\n\n${field.charAt(0).toUpperCase() + field.slice(1)}: ${value}
      `;

      return await sock.sendMessage(from, {
        text: updateText,
      });
    } catch (error) {
      logger.error(`Fehler in editprofile command: ${error.message}`);
    }
  },
};
