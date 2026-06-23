const User = require('../../models/User');
const logger = require('../../utils/logger');

module.exports = {
  name: 'ssp',
  aliases: ['rsp', 'rockpaperscissors', 'scherensteinpapier'],
  description: 'Schere-Stein-Papier gegen den Bot',
  category: 'minigames',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `✂️ Schere-Stein-Papier!\n\nBeispiel: ${prefix}ssp schere\n\nOptionen: schere, stein, papier`,
        });
      }

      const choices = ['schere', 'stein', 'papier'];
      const userChoice = args[0].toLowerCase();

      if (!choices.includes(userChoice)) {
        return await sock.sendMessage(from, {
          text: `❌ Ungültige Wahl! Nutze: schere, stein, papier`,
        });
      }

      const botChoice = choices[Math.floor(Math.random() * 3)];
      const emojis = { schere: '✂️', stein: '🪨', papier: '📄' };

      let result = '';
      let won = false;

      if (userChoice === botChoice) {
        result = 'Unentschieden! 🤝';
      } else if (
        (userChoice === 'schere' && botChoice === 'papier') ||
        (userChoice === 'stein' && botChoice === 'schere') ||
        (userChoice === 'papier' && botChoice === 'stein')
      ) {
        result = 'Du hast gewonnen! 🎉';
        won = true;
      } else {
        result = 'Bot gewinnt! 🤖';
      }

      // XP geben wenn gewonnen
      if (won) {
        await User.findOneAndUpdate(
          { phoneNumber: sender },
          { $inc: { xp: 10 } }
        );
      }

      const sspText = `
✂️ **SCHERE-STEIN-PAPIER**

Du: ${emojis[userChoice]}
Bot: ${emojis[botChoice]}

${result}
${won ? '+10 XP 🌟' : ''}
      `;

      return await sock.sendMessage(from, {
        text: sspText,
      });
    } catch (error) {
      logger.error(`Fehler in ssp command: ${error.message}`);
    }
  },
};
