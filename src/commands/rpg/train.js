const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'train',
  aliases: ['workout', 'trainieren'],
  description: 'Trainiere deine Stats',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `💪 Wähle einen Stat zum trainieren!\n\nOptionen: str, int, dex, con, wis, cha\n\nBeispiel: ${prefix}train str`,
        });
      }

      const character = await RPGCharacter.findOne({ userId: sender });

      if (!character) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter!`,
        });
      }

      if (character.health < 10) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist zu erschöpft! Heile dich mit ${prefix}heal`,
        });
      }

      const stat = args[0].toLowerCase();
      const statMap = {
        'str': 'strength',
        'int': 'intelligence',
        'dex': 'dexterity',
        'con': 'constitution',
        'wis': 'wisdom',
        'cha': 'charisma',
      };

      if (!statMap[stat]) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiger Stat! Verfügbar: str, int, dex, con, wis, cha`,
        });
      }

      const statName = statMap[stat];
      const oldValue = character[statName];
      const bonus = Math.floor(Math.random() * 3) + 1; // +1 bis +3
      character[statName] += bonus;
      character.health -= 5; // Kosten für Training

      await character.save();

      const trainText = `
💪 **TRAINING**\n\n${stat.toUpperCase()}: ${oldValue} → ${character[statName]} (+${bonus})\n\n❤️ Health: ${character.health}/${character.maxHealth}\n\nTraining hart! 💪
      `;

      return await sock.sendMessage(from, {
        text: trainText,
      });
    } catch (error) {
      logger.error(`Fehler in train command: ${error.message}`);
    }
  },
};
