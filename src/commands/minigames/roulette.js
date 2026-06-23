const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'roulette',
  aliases: ['wheel', 'spin'],
  description: 'Roulette - setze auf Farben oder Zahlen',
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

      if (args.length < 2) {
        return await sock.sendMessage(from, {
          text: `🎰 Roulette - Wette auf Farbe oder Zahl!\n\nBeispiele:\n${prefix}roulette 100 rot\n${prefix}roulette 100 schwarz\n${prefix}roulette 100 17\n\nDein Kontostand: $${user.wallet}`,
        });
      }

      const bet = parseInt(args[0]);
      const choice = args[1].toLowerCase();

      if (isNaN(bet) || bet <= 0 || bet > user.wallet) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültiger Betrag!`,
        });
      }

      const winningNumber = Math.floor(Math.random() * 37); // 0-36
      const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber);
      const winningColor = winningNumber === 0 ? 'grün' : isRed ? 'rot' : 'schwarz';

      let won = false;
      let winMultiplier = 0;

      if (choice === 'rot' && winningColor === 'rot') {
        won = true;
        winMultiplier = 2;
      } else if (choice === 'schwarz' && winningColor === 'schwarz') {
        won = true;
        winMultiplier = 2;
      } else if (choice === 'grün' && winningNumber === 0) {
        won = true;
        winMultiplier = 36;
      } else if (!isNaN(parseInt(choice))) {
        const chosenNumber = parseInt(choice);
        if (chosenNumber >= 0 && chosenNumber <= 36 && chosenNumber === winningNumber) {
          won = true;
          winMultiplier = 36;
        }
      }

      const reward = won ? (bet * winMultiplier) - bet : -bet;
      user.wallet += reward;
      await user.save();

      const rouletteText = `
🎰 **ROULETTE**

🔴 Die Kugel landet auf: ${winningNumber} (${winningColor})

Deine Wette: ${choice}

${won ? `🎉 Du gewinnst: $${bet * winMultiplier}!` : `😢 Du verlierst: $${bet}`}

💸 Netto: ${reward > 0 ? '+' : ''}$${reward}
🎰 Dein neuer Kontostand: $${user.wallet}
      `;

      return await sock.sendMessage(from, {
        text: rouletteText,
      });
    } catch (error) {
      logger.error(`Fehler in roulette command: ${error.message}`);
    }
  },
};
