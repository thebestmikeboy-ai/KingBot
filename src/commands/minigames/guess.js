const User = require('../../models/User');
const logger = require('../../utils/logger');

const activeGuesses = new Map();

module.exports = {
  name: 'guess',
  aliases: ['guessnum', 'zahlenratespiel'],
  description: 'Rate die Zahl von 1-100',
  category: 'minigames',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      // Wenn das Spiel schon läuft
      if (activeGuesses.has(sender)) {
        const gameData = activeGuesses.get(sender);
        const guess = parseInt(args[0]);

        if (isNaN(guess)) {
          return await sock.sendMessage(from, {
            text: `❌ Gib eine Zahl zwischen 1 und 100 ein!`,
          });
        }

        gameData.attempts++;

        if (guess === gameData.number) {
          const reward = Math.max(50 - gameData.attempts * 5, 10);
          await User.findOneAndUpdate(
            { phoneNumber: sender },
            { $inc: { wallet: reward, xp: 10 } }
          );

          activeGuesses.delete(sender);

          const winText = `
🎉 **GEWONNEN!**

✅ Die Zahl war: **${gameData.number}**
Versuche: ${gameData.attempts}
💰 Belohnung: $${reward}
🌟 +10 XP
          `;

          return await sock.sendMessage(from, {
            text: winText,
          });
        } else if (guess > gameData.number) {
          return await sock.sendMessage(from, {
            text: `📊 Die Zahl ist **kleiner**! ⬇️\n\nVersuche: ${gameData.attempts}`,
          });
        } else {
          return await sock.sendMessage(from, {
            text: `📊 Die Zahl ist **größer**! ⬆️\n\nVersuche: ${gameData.attempts}`,
          });
        }
      }

      // Neues Spiel starten
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      activeGuesses.set(sender, {
        number: randomNumber,
        attempts: 0,
        startedAt: Date.now(),
      });

      // Timeout nach 5 Minuten
      setTimeout(() => {
        if (activeGuesses.has(sender)) {
          activeGuesses.delete(sender);
        }
      }, 300000);

      const startText = `
🎯 **ZAHLENRATESPIEL**

Ich habe eine Zahl zwischen 1 und 100 gedacht!
Rate sie! 🤔

Beispiel: ${prefix}guess 50
      `;

      return await sock.sendMessage(from, {
        text: startText,
      });
    } catch (error) {
      logger.error(`Fehler in guess command: ${error.message}`);
    }
  },
};
