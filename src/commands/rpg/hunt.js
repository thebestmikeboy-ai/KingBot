const RPGCharacter = require('../../models/RPGCharacter');
const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'hunt',
  aliases: ['monster', 'monsterJag'],
  description: 'Jage Monster und verdiene Belohnungen',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const character = await RPGCharacter.findOne({ userId: sender });
      const user = await User.findOne({ phoneNumber: sender });

      if (!character) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter!`,
        });
      }

      if (character.health < 20) {
        return await sock.sendMessage(from, {
          text: `❌ Dein Charakter ist zu schwach! Ruhe dich aus (Health: ${character.health}/${character.maxHealth})`,
        });
      }

      const monsters = [
        { name: 'Goblin', difficulty: 1, health: 30, reward: 50, xp: 20 },
        { name: 'Orc', difficulty: 2, health: 60, reward: 100, xp: 40 },
        { name: 'Skelett', difficulty: 2, health: 40, reward: 80, xp: 35 },
        { name: 'Troll', difficulty: 3, health: 100, reward: 150, xp: 60 },
        { name: 'Dragon', difficulty: 4, health: 200, reward: 300, xp: 100 },
      ];

      const monster = monsters[Math.floor(Math.random() * monsters.length)];
      const damage = Math.floor(Math.random() * (character.strength + 10)) + 5;
      const monsterDamage = Math.floor(Math.random() * (monster.health / 10)) + 3;

      const battleLog = `
🗡️ **MONSTER-JAGD**

👹 Monster: ${monster.name} (Difficulty: ${monster.difficulty})\nHealth: ${monster.health}\n\n
      `;

      // Vereinfachter Kampf: Spieler besiegt Monster
      let playerDamageTaken = 0;
      let monstersDefeated = 0;
      let currentMonsterHealth = monster.health;

      while (currentMonsterHealth > 0) {
        currentMonsterHealth -= damage;
        playerDamageTaken += monsterDamage / 2; // Monster macht nur halben Schaden
      }

      character.health -= Math.floor(playerDamageTaken);
      character.health = Math.max(0, character.health);
      character.totalDamageDealt += damage;
      character.totalDamageTaken += Math.floor(playerDamageTaken);
      character.wins += 1;
      character.experience += monster.xp;

      user.wallet += monster.reward;
      user.xp += monster.xp / 2;

      await character.save();
      await user.save();

      const victoryText = `
${battleLog}
⚔️ Du greifst an: ${damage} Schaden\n💀 Monster greift an: ${Math.floor(monsterDamage / 2)} Schaden\n\n✅ **${monster.name} besiegt!**\n\n💰 Belohnung: $${monster.reward}\n⭐ XP: +${monster.xp}\n❤️ Deine Health: ${character.health}/${character.maxHealth}
      `;

      return await sock.sendMessage(from, {
        text: victoryText,
      });
    } catch (error) {
      logger.error(`Fehler in hunt command: ${error.message}`);
    }
  },
};
