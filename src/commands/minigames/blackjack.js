const User = require('../../models/User');
const logger = require('../../utils/logger');

const activeGames = new Map();

module.exports = {
  name: 'blackjack',
  aliases: ['bj', '21'],
  description: 'Blackjack - setze Geld ein!',
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

      // Laufendes Spiel
      if (activeGames.has(sender)) {
        const game = activeGames.get(sender);
        const action = args[0]?.toLowerCase();

        if (action === 'hit') {
          const card = getRandomCard();
          game.playerCards.push(card);
          const playerValue = calculateValue(game.playerCards);

          if (playerValue > 21) {
            const reward = -game.bet;
            user.wallet += reward;
            await user.save();
            activeGames.delete(sender);

            return await sock.sendMessage(from, {
              text: `
💥 **BUST!** Du bist über 21!\n
Deine Karten: ${game.playerCards.join('')}\nWert: ${playerValue}\n\n💸 -$${game.bet}
              `,
            });
          }

          return await sock.sendMessage(from, {
            text: `
🃏 Deine Karten: ${game.playerCards.join('')}\nWert: ${playerValue}\n\n${prefix}blackjack hit oder ${prefix}blackjack stand?
            `,
          });
        } else if (action === 'stand') {
          let dealerValue = calculateValue(game.dealerCards);
          while (dealerValue < 17) {
            game.dealerCards.push(getRandomCard());
            dealerValue = calculateValue(game.dealerCards);
          }

          const playerValue = calculateValue(game.playerCards);
          let result = '';
          let reward = 0;

          if (dealerValue > 21) {
            result = `🎉 Dealer bust! Du gewinnst!`;
            reward = game.bet;
          } else if (playerValue > dealerValue) {
            result = `🎉 Du gewinnst!`;
            reward = game.bet;
          } else if (playerValue === dealerValue) {
            result = `🤝 Draw!`;
            reward = 0;
          } else {
            result = `😢 Dealer gewinnt!`;
            reward = -game.bet;
          }

          user.wallet += reward;
          await user.save();
          activeGames.delete(sender);

          const gameText = `
🃏 **BLACKJACK - ENDERGEBNIS**

Deine Karten: ${game.playerCards.join('')}\nWert: ${playerValue}\n\nDealer Karten: ${game.dealerCards.join('')}\nWert: ${dealerValue}\n\n${result}\n💸 ${reward > 0 ? '+' : ''}$${reward}
          `;

          return await sock.sendMessage(from, {
            text: gameText,
          });
        }
      }

      // Neues Spiel
      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `🃏 Setze einen Betrag ein!\n\nBeispiel: ${prefix}blackjack 100\n\nDein Kontostand: $${user.wallet}`,
        });
      }

      const bet = parseInt(args[0]);

      if (isNaN(bet) || bet <= 0 || bet > user.wallet) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiger Betrag!`,
        });
      }

      const playerCards = [getRandomCard(), getRandomCard()];
      const dealerCards = [getRandomCard()];
      const playerValue = calculateValue(playerCards);

      activeGames.set(sender, {
        bet,
        playerCards,
        dealerCards,
      });

      const startText = `
🃏 **BLACKJACK**

Deine Karten: ${playerCards.join('')}\nWert: ${playerValue}\n\nDealer: ${dealerCards[0]}\n\n${prefix}blackjack hit oder ${prefix}blackjack stand?
      `;

      return await sock.sendMessage(from, {
        text: startText,
      });
    } catch (error) {
      logger.error(`Fehler in blackjack command: ${error.message}`);
    }
  },
};

function getRandomCard() {
  const cards = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮'];
  return cards[Math.floor(Math.random() * cards.length)];
}

function calculateValue(cards) {
  const values = {
    '🂡': 11, '🂢': 2, '🂣': 3, '🂤': 4, '🂥': 5, '🂦': 6, '🂧': 7, '🂨': 8, '🂩': 9, '🂪': 10,
    '🂫': 10, '🂭': 10, '🂮': 10
  };

  let value = 0;
  let aces = 0;

  cards.forEach(card => {
    const cardValue = values[card] || 0;
    if (cardValue === 11) aces++;
    value += cardValue;
  });

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}
