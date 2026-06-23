const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'lotto',
  aliases: ['lottery'],
  description: 'Lottozahlen - setze Geld ein!',
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

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `🎰 Setze einen Betrag ein!\n\nBeispiel: ${prefix}lotto 100\n\nDein Kontostand: $${user.wallet}`,
        });
      }

      const bet = parseInt(args[0]);

      if (isNaN(bet) || bet <= 0) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiger Betrag!`,
        });
      }

      if (bet > user.wallet) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast nicht genug Guthaben!`,
        });
      }

      // 6 Zahlen aus 49
      const generateNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
          numbers.add(Math.floor(Math.random() * 49) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
      };

      const winningNumbers = generateNumbers();
      const yourNumbers = generateNumbers();

      // Zähle Treffer
      const matches = yourNumbers.filter(num => winningNumbers.includes(num)).length;

      const winTable = {
        0: 0,
        1: 0,
        2: 0,
        3: bet * 5,
        4: bet * 50,
        5: bet * 500,
        6: bet * 5000,
      };

      const winnings = winTable[matches] - bet;

      user.wallet += winnings;
      await user.save();

      const lottoText = `
🎰 **LOTTERIE**

🎟️ Deine Zahlen: ${yourNumbers.join(', ')}
🏆 Gewinnzahlen: ${winningNumbers.join(', ')}

✨ Treffer: **${matches}/6**

${matches === 0 ? '😢 Leider keine Treffer!' : `🎉 Du gewinnst: $${winTable[matches]}!`}

💸 Netto: ${winnings > 0 ? '+' : ''}$${winnings}
🎰 Dein neuer Kontostand: $${user.wallet}
      `;

      return await sock.sendMessage(from, {
        text: lottoText,
      });
    } catch (error) {
      logger.error(`Fehler in lotto command: ${error.message}`);
    }
  },
};
