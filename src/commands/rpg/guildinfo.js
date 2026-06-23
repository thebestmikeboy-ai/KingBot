const Guild = require('../../models/Guild');
const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'guildinfo',
  aliases: ['guild', 'myguild'],
  description: 'Zeige Gilden-Infos',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const character = await RPGCharacter.findOne({ userId: sender });

      if (!character || !character.guildId) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist in keiner Gilde!\n\nErstelle eine mit ${prefix}createguild`,
        });
      }

      const guild = await Guild.findOne({ guildId: character.guildId });

      if (!guild) {
        return await sock.sendMessage(from, {
          text: `❌ Gilde nicht gefunden!`,
        });
      }

      let guildText = `
╔════════════════════════════════════════╗
║  🏰 GILDE - ${guild.guildName.padEnd(24)}║
╠════════════════════════════════════════╣
║                                        ║
║ 👑 Leader: ${guild.leader.padEnd(30)}║
║ 📝 ${guild.description.substring(0, 37).padEnd(37)}║
║                                        ║
║ 💰 Gildenkasse: $${String(guild.guildBank).padEnd(27)}║
║ 📊 Level: ${String(guild.level).padEnd(31)}║
║ ⭐ Erfahrung: ${String(guild.experience).padEnd(28)}║
║                                        ║
║ 👥 Mitglieder: ${guild.members.length}/${10 + (guild.level * 5)}           ║
║                                        ║
`;

      guild.members.forEach((member, index) => {
        if (index < 5) {
          guildText += `║ • ${member.rank.padEnd(8)} (${member.userId.substring(0, 10)}...)          ║\n`;
        }
      });

      if (guild.members.length > 5) {
        guildText += `║ ... und ${guild.members.length - 5} weitere                       ║\n`;
      }

      guildText += `║                                        ║
╚════════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: guildText,
      });
    } catch (error) {
      logger.error(`Fehler in guildinfo command: ${error.message}`);
    }
  },
};
