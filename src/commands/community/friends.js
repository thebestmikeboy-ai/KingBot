const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'friends',
  aliases: ['friendlist', 'myfriends'],
  description: 'Zeige deine Freundesliste',
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

      if (user.friends.length === 0) {
        return await sock.sendMessage(from, {
          text: `😔 Du hast noch keine Freunde!\n\nFüge welche mit ${prefix}addfriend hinzu!`,
        });
      }

      const friendUsers = await User.find({ phoneNumber: { $in: user.friends } }).select('username level xp');

      let friendText = `
👥 **FREUNDESLISTE** (${user.friends.length})\n\n`;

      friendUsers.forEach((friend, index) => {
        friendText += `${index + 1}. ${friend.username}\n   Lvl ${friend.level} | XP ${friend.xp}\n\n`;
      });

      return await sock.sendMessage(from, {
        text: friendText,
      });
    } catch (error) {
      logger.error(`Fehler in friends command: ${error.message}`);
    }
  },
};
