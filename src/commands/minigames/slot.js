const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'slot',
  aliases: ['slots', 'slotmaschine'],
  description: 'Slotmaschine - setze Geld ein!',
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
          text: `🎰 Setze einen Betrag ein!\n\nBeispiel: ${prefix}slot 100\n\nDein Kontostand: $${user.wallet}`,
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

      const symbols = ['🍎', '🍊', '🍋', '🍌', '🍇', '⭐', '💎', '🔔'];
      const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
      const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
      const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

      let winnings = 0;
      let message_text = '';

      if (reel1 === reel2 && reel2 === reel3) {
        // JACKPOT!
        winnings = bet * 10;
        message_text = `
🎉 **JACKPOT!!!** 🎉

${reel1} ${reel2} ${reel3}

💰 Du gewinnst: $${winnings}!
        `;
      } else if (reel1 === reel2 || reel2 === reel3) {
        // Zwei gleich
        winnings = bet * 3;
        message_text = `
✨ Zwei gleich! ✨

${reel1} ${reel2} ${reel3}

💰 Du gewinnst: $${winnings}!
        `;
      } else {
        // Verloren
        winnings = -bet;
        message_text = `
😢 Leider nichts gewonnen!

${reel1} ${reel2} ${reel3}

💸 -$${bet}
        `;
      }

      user.wallet += winnings;
      await user.save();

      message_text += `\n\n🎰 Dein neuer Kontostand: $${user.wallet}`;

      return await sock.sendMessage(from, {
        text: message_text,
      });
    } catch (error) {
      logger.error(`Fehler in slot command: ${error.message}`);
    }
  },
};
