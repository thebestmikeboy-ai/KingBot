const User = require('../../models/User');
const logger = require('../../utils/logger');

const activeMemoryGames = new Map();

module.exports = {
  name: 'memory',
  aliases: ['memo'],
  description: 'Memory Spiel - finde die Paare!',
  category: 'minigames',

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

      const action = args[0]?.toLowerCase();

      // Laufendes Spiel - Karte umdrehen
      if (action === 'flip' && activeMemoryGames.has(sender)) {
        const game = activeMemoryGames.get(sender);
        const cardIndex = parseInt(args[1]);

        if (isNaN(cardIndex) || cardIndex < 1 || cardIndex > 8) {
          return await sock.sendMessage(from, {
            text: `❌ Ungültige Kartennummer! (1-8)`,
          });
        }

        const actualIndex = cardIndex - 1;

        if (game.revealed.includes(actualIndex)) {
          return await sock.sendMessage(from, {
            text: `❌ Diese Karte wurde bereits aufgedeckt!`,
          });
        }

        const card = game.cards[actualIndex];
        game.lastFlip.push(actualIndex);

        let response = `🎴 Karte ${cardIndex}: ${card}\n\n`;

        if (game.lastFlip.length === 2) {
          const card1 = game.cards[game.lastFlip[0]];
          const card2 = game.cards[game.lastFlip[1]];

          if (card1 === card2) {
            game.revealed.push(game.lastFlip[0], game.lastFlip[1]);
            game.matches++;
            response += `✅ Paar gefunden! ${card1}\n\n`;

            if (game.matches === 4) {
              const reward = 150;
              user.wallet += reward;
              user.xp += 15;
              await user.save();
              activeMemoryGames.delete(sender);

              return await sock.sendMessage(from, {
                text: `
🎉 **SPIEL GEWONNEN!**

Versuche: ${game.attempts}\n💰 +$${reward}\n🌟 +15 XP
              `,
              });
            }
          } else {
            response += `❌ Kein Paar! ${card1} und ${card2}\n\n`;
          }

          game.attempts++;
          game.lastFlip = [];
        }

        response += `
📊 Funde: ${game.matches}/4\nVersuche: ${game.attempts}\n\n`;

        // Zeige aktuellen Spielstand
        let board = '';
        for (let i = 0; i < 8; i++) {
          board += game.revealed.includes(i) ? `${game.cards[i]}` : '❓';
          if ((i + 1) % 4 === 0) board += '\n';
          else board += ' ';
        }

        response += board;
        response += `\nNächste Karte: ${prefix}memory flip [1-8]`;

        return await sock.sendMessage(from, {
          text: response,
        });
      }

      // Neues Spiel starten
      const symbols = ['🍎', '🍊', '🍋', '🍌', '🍇', '⭐', '💎', '🔔'];
      const cards = [...symbols, ...symbols];

      // Shuffle
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }

      activeMemoryGames.set(sender, {
        cards: cards.slice(0, 8),
        revealed: [],
        matches: 0,
        attempts: 0,
        lastFlip: [],
      });

      let board = '';
      for (let i = 1; i <= 8; i++) {
        board += '❓';
        if (i % 4 === 0) board += '\n';
        else board += ' ';
      }

      const startText = `
🎴 **MEMORY SPIEL**

Finde alle 4 Paare!\n\n${board}\n\nAktion: ${prefix}memory flip [1-8]
      `;

      return await sock.sendMessage(from, {
        text: startText,
      });
    } catch (error) {
      logger.error(`Fehler in memory command: ${error.message}`);
    }
  },
};
