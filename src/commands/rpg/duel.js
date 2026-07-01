const RPGCharacter = require('../../models/RPGCharacter');
const logger = require('../../utils/logger');

const activeDuels = new Map();

module.exports = {
  name: 'duel',
  aliases: ['fight', 'kampf'],
  description: 'Duel mit anderen Charakteren',
  category: 'rpg',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;
      const isGroup = from?.endsWith('@g.us');

      if (!isGroup) {
        return await sock.sendMessage(from, {
          text: `❌ Duels funktionieren nur in Gruppen!`,
        });
      }

      // Check auf Duel-Angebot
      const challengeKey = `${sender}-challenge`;
      if (activeDuels.has(challengeKey)) {
        const challenge = activeDuels.get(challengeKey);
        
        if (challenge.status === 'waiting') {
          return await sock.sendMessage(from, {
            text: `⏳ Du hast bereits einen Duel-Request ausstehend!`,
          });
        }
      }

      const player1 = await RPGCharacter.findOne({ userId: sender });

      if (!player1) {
        return await sock.sendMessage(from, {
          text: `❌ Du hast keinen Charakter!`,
        });
      }

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `⚔️ Fordere jemanden heraus!\n\nBeispiel: ${prefix}duel @user`,
        });
      }

      // Extrahiere @mention
      const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      
      if (!mentionedJid) {
        return await sock.sendMessage(from, {
          text: `❌ Erwähne einen Benutzer mit @`,
        });
      }

      const player2 = await RPGCharacter.findOne({ userId: mentionedJid });

      if (!player2) {
        return await sock.sendMessage(from, {
          text: `❌ Der andere Spieler hat keinen Charakter!`,
        });
      }

      // Speichere Duel-Request
      activeDuels.set(challengeKey, {
        challenger: player1,
        challenger_id: sender,
        opponent: player2,
        opponent_id: mentionedJid,
        status: 'waiting',
        createdAt: Date.now(),
      });

      // Timeout nach 1 Minute
      setTimeout(() => {
        if (activeDuels.has(challengeKey)) {
          activeDuels.delete(challengeKey);
        }
      }, 60000);

      const challengeText = `
⚔️ **DUEL HERAUSFORDERUNG**

🗡️ ${player1.characterName} (${player1.class}) fordert dich heraus!

Akzeptieren: ${prefix}accept
Ablehnen: ${prefix}deny

⏰ Verfällt in 1 Minute
      `;

      return await sock.sendMessage(from, {
        text: challengeText,
      });
    } catch (error) {
      logger.error(`Fehler in duel command: ${error.message}`);
    }
  },
};
