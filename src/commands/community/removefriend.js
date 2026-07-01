const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'removefriend',
  aliases: ['unfriend', 'delfriend'],
  description: 'Entferne einen Freund',
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

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `👤 Gib einen Benutzernamen an!\n\nBeispiel: ${prefix}removefriend username`,
        });
      }

      const friendName = args[0];
      const friend = await User.findOne({ username: friendName });

      if (!friend) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${friendName}" nicht gefunden!`,
        });
      }

      if (!user.friends.includes(friend.phoneNumber)) {
        return await sock.sendMessage(from, {
          text: `❌ ${friendName} ist nicht dein Freund!`,
        });
      }

      user.friends = user.friends.filter(f => f !== friend.phoneNumber);
      friend.friends = friend.friends.filter(f => f !== sender);

      await user.save();
      await friend.save();

      const removeText = `
✅ ${friendName} wurde aus deiner Freundesliste entfernt!\n\n👥 Deine Freunde: ${user.friends.length}
      `;

      return await sock.sendMessage(from, {
        text: removeText,
      });
    } catch (error) {
      logger.error(`Fehler in removefriend command: ${error.message}`);
    }
  },
};
