const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'charinfo',
  aliases: ['char', 'charstat'],
  description: 'Zeige deine Charakter-Infos',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const character = await RPGCharacter.findOne({ userId: sender });

      if (!character) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter! Erstelle einen mit ${prefix}createchar [Name] [Klasse]`,
        });
      }

      const charInfoText = `
╔═══════════════════════════════════════╗
║  🗡️ CHARAKTER INFO - ${character.characterName.padEnd(22)}║
╠═══════════════════════════════════════╣
║                                       ║
║ ⚔️ Klasse: ${character.class.padEnd(29)}║
║ 🏘️ Rasse: ${character.race.padEnd(31)}║
║ 📍 Standort: ${character.currentLocation.padEnd(26)}║
║                                       ║
║ 📊 STATS:                             ║
║  STR: ${String(character.strength).padEnd(3)} | INT: ${String(character.intelligence).padEnd(3)} | DEX: ${String(character.dexterity).padEnd(3)} ║
║  CON: ${String(character.constitution).padEnd(3)} | WIS: ${String(character.wisdom).padEnd(3)} | CHA: ${String(character.charisma).padEnd(3)} ║
║                                       ║
║ ❤️ Health: ${character.health}/${character.maxHealth}                        ║
║ 💙 Mana: ${character.mana}/${character.maxMana}                            ║
║                                       ║
║ 📈 Level: ${character.level}                                 ║
║ ⭐ Experience: ${character.experience}                         ║
║                                       ║
║ ⚔️ Kämpfe: ${String(character.wins).padEnd(3)} Gewonnen                   ║
║ 💀 Kämpfe: ${String(character.losses).padEnd(3)} Verloren                  ║
║                                       ║
║ 🐾 Pet: ${(character.pet || 'Keine').padEnd(32)}║
║ 🏰 Gilde: ${(character.guildId || 'Keine').padEnd(31)}║
║                                       ║
╚═══════════════════════════════════════╝
      `;

      return await sock.sendMessage(from, {
        text: charInfoText,
      });
    } catch (error) {
      logger.error(`Fehler in charinfo command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
