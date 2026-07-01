const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'divorce',
  aliases: ['unmary', 'breakup'],
  description: 'Trenne dich von deinem Partner',
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

      if (!user.marriedTo) {
        return await sock.sendMessage(from, {
          text: `😔 Du bist gar nicht verheiratet!`,
        });
      }

      const partnerName = user.marriedTo;
      const partner = await User.findOne({ username: partnerName });

      if (partner) {
        partner.marriedTo = null;
        partner.marriageDate = null;
        await partner.save();
      }

      user.marriedTo = null;
      user.marriageDate = null;
      await user.save();

      const divorceText = `
💔 **SCHEIDUNG**\n\nDu hast dich von ${partnerName} getrennt...\n\nAlles Gute für die Zukunft! 👋
      `;

      return await sock.sendMessage(from, {
        text: divorceText,
      });
    } catch (error) {
      logger.error(`Fehler in divorce command: ${error.message}`);
    }
  },
};
