const RPGCharacter = require('../../models/RPGCharacter');
const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'createchar',
  aliases: ['newchar', 'charCreate'],
  description: 'Erstelle einen RPG-Charakter',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `⚔️ Charakter erstellen!\n\nBeispiel: ${prefix}createchar Aragorn Warrior\n\nKlassen: Warrior, Mage, Archer, Rogue, Paladin\n\nDein Charakter erhält:\n❤️ 100 HP | 50 Mana\n⚡ 10 Stats in jedem Attribut`,
        });
      }

      const characterName = args[0];
      const characterClass = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase();

      const validClasses = ['Warrior', 'Mage', 'Archer', 'Rogue', 'Paladin'];
      if (!validClasses.includes(characterClass)) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültige Klasse! Verfügbar: Warrior, Mage, Archer, Rogue, Paladin`,
        });
      }

      // Check ob bereits Charakter existiert
      const existingChar = await RPGCharacter.findOne({ userId: sender });
      if (existingChar) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast bereits einen Charakter! Lösche ihn mit ${prefix}deletechar`,
        });
      }

      // Erstelle Charakter
      const newChar = new RPGCharacter({
        characterId: `${sender}-${Date.now()}`,
        userId: sender,
        characterName,
        class: characterClass,
        strength: 10,
        intelligence: 10,
        dexterity: 10,
        constitution: 10,
        wisdom: 10,
        charisma: 10,
      });

      // Bonus-Stats basierend auf Klasse
      if (characterClass === 'Warrior') {
        newChar.strength += 5;
        newChar.constitution += 3;
        newChar.maxHealth = 150;
        newChar.health = 150;
      } else if (characterClass === 'Mage') {
        newChar.intelligence += 5;
        newChar.wisdom += 3;
        newChar.maxMana = 100;
        newChar.mana = 100;
      } else if (characterClass === 'Archer') {
        newChar.dexterity += 5;
        newChar.wisdom += 2;
      } else if (characterClass === 'Rogue') {
        newChar.dexterity += 5;
        newChar.charisma += 2;
      } else if (characterClass === 'Paladin') {
        newChar.strength += 3;
        newChar.wisdom += 5;
        newChar.maxHealth = 120;
        newChar.health = 120;
      }

      await newChar.save();

      const charText = `
✅ Charakter erstellt!\n\n🗡️ Name: ${characterName}\n⚔️ Klasse: ${characterClass}\n\n📊 Stats:\nSTR: ${newChar.strength}\nINT: ${newChar.intelligence}\nDEX: ${newChar.dexterity}\nCON: ${newChar.constitution}\nWIS: ${newChar.wisdom}\nCHA: ${newChar.charisma}\n\n❤️ HP: ${newChar.health}/${newChar.maxHealth}\n💙 Mana: ${newChar.mana}/${newChar.maxMana}\n\nAuf geht's ins Abenteuer! 🌟
      `;

      return await sock.sendMessage(from, {
        text: charText,
      });
    } catch (error) {
      logger.error(`Fehler in createchar command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
