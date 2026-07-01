const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'marry',
  aliases: ['heiraten', 'proposeto'],
  description: 'Mache jemandem einen Heiratsantrag',
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

      if (user.marriedTo) {
        return await sock.sendMessage(from, {
          text: `😥 Du bist bereits verheiratet mit ${user.marriedTo}!`,
        });
      }

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `💍 Gib einen Benutzernamen an!\n\nBeispiel: ${prefix}marry username`,
        });
      }

      const partnerName = args[0];
      const partner = await User.findOne({ username: partnerName });

      if (!partner) {
        return await sock.sendMessage(from, {
          text: `❌ Benutzer "${partnerName}" nicht gefunden!`,
        });
      }

      if (partner.phoneNumber === sender) {
        return await sock.sendMessage(from, {
          text: `🤣 Du kannst dich nicht selbst heiraten!`,
        });
      }

      if (partner.marriedTo) {
        return await sock.sendMessage(from, {
          text: `😥 ${partnerName} ist bereits verheiratet!`,
        });
      }

      user.marriedTo = partnerName;
      user.marriageDate = new Date();
      partner.marriedTo = user.username;
      partner.marriageDate = new Date();

      await user.save();
      await partner.save();

      const marryText = `
😍 💍 **IHR SEID VERHEIRATET!** 💍 😍\n\n${user.username} ❤️ ${partnerName}\n\nGlücwunsch! 🌟
      `;

      return await sock.sendMessage(from, {
        text: marryText,
      });
    } catch (error) {
      logger.error(`Fehler in marry command: ${error.message}`);
    }
  },
};
