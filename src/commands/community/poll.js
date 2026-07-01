const GlobalPoll = require('../../models/GlobalPoll');
const User = require('../../models/User');
const logger = require('../../utils/logger');

const activePollsCreation = new Map();

module.exports = {
  name: 'poll',
  aliases: ['abstimmung', 'vote'],
  description: 'Erstelle oder stimme bei einer Umfrage ab',
  category: 'community',

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

      if (action === 'create') {
        if (args.length < 3) {
          return await sock.sendMessage(from, {
            text: `📂 Erstelle eine Umfrage!\n\nBeispiel: ${prefix}poll create "Frage?" "Option 1" "Option 2"`,
          });
        }

        const question = args[1];
        const options = args.slice(2);

        if (options.length < 2) {
          return await sock.sendMessage(from, {
            text: `❌ Du brauchst mindestens 2 Optionen!`,
          });
        }

        const poll = new GlobalPoll({
          pollId: `poll-${Date.now()}`,
          question,
          options: options.map((opt, i) => ({ optionId: i + 1, text: opt, votes: 0 })),
          createdBy: sender,
        });

        await poll.save();

        let pollText = `
📂 **UMFRAGE ERSTELLT**\n\n${question}\n\n`;
        poll.options.forEach(opt => {
          pollText += `${opt.optionId}. ${opt.text}\n`;
        });
        pollText += `\n${prefix}poll vote ${poll.pollId} [1-${options.length}]`;

        return await sock.sendMessage(from, {
          text: pollText,
        });
      } else if (action === 'vote') {
        if (args.length < 3) {
          return await sock.sendMessage(from, {
            text: `📂 Stimme ab!\n\nBeispiel: ${prefix}poll vote [pollId] [1-X]`,
          });
        }

        const pollId = args[1];
        const optionId = parseInt(args[2]);

        const poll = await GlobalPoll.findOne({ pollId });

        if (!poll) {
          return await sock.sendMessage(from, {
            text: `❌ Umfrage nicht gefunden!`,
          });
        }

        if (poll.voters.some(v => v.userId === sender)) {
          return await sock.sendMessage(from, {
            text: `❌ Du hast bereits abgestimmt!`,
          });
        }

        const option = poll.options.find(o => o.optionId === optionId);
        if (!option) {
          return await sock.sendMessage(from, {
            text: `❌ Ungültige Option!`,
          });
        }

        option.votes += 1;
        poll.voters.push({ userId: sender, chosenOption: optionId });
        await poll.save();

        let voteText = `
✅ Deine Stimme wurde gezählt!\n\n${poll.question}\n\nAktuelle Ergebnisse:\n`;
        poll.options.forEach(opt => {
          voteText += `${opt.optionId}. ${opt.text}: ${opt.votes} Stimmen\n`;
        });

        return await sock.sendMessage(from, {
          text: voteText,
        });
      } else {
        return await sock.sendMessage(from, {
          text: `📂 Umfrage Befehle:\n${prefix}poll create\n${prefix}poll vote`,
        });
      }
    } catch (error) {
      logger.error(`Fehler in poll command: ${error.message}`);
    }
  },
};
