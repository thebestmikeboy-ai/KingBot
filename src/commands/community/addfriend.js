const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'addfriend',
  aliases: ['befriend', 'friend'],
  description: 'Füge einen Freund hinzu',
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
          text: `👤 Gib einen Benutzernamen an!\n\nBeispiel: ${prefix}addfriend username`,
        });
      }

      const friendName = args[0];
      const friend = await User.findOne({ username: friendName });

      if (!friend) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${friendName}" nicht gefunden!`,
        });
      }

      if (friend.phoneNumber === sender) {
        return await sock.sendMessage(from, {
          text: `🤣 Du kannst dich nicht selbst als Freund hinzufügen!`,
        });
      }

      if (user.friends.includes(friend.phoneNumber)) {
        return await sock.sendMessage(from, {
          text: `❌ ${friendName} ist bereits dein Freund!`,
        });
      }

      user.friends.push(friend.phoneNumber);
      friend.friends.push(sender);

      await user.save();
      await friend.save();

      const addText = `
✅ ${friendName} wurde als Freund hinzugefügt!\n\n👥 Deine Freunde: ${user.friends.length}
      `;

      return await sock.sendMessage(from, {
        text: addText,
      });
    } catch (error) {
      logger.error(`Fehler in addfriend command: ${error.message}`);
    }
  },
};
