const roasts = [
  "Du bist so langweilig, dass nicht mal deine Kontakte deine Nummer anrufen!",
  "Deine Fähigkeiten sind wie meine sozialen Fähigkeiten... minimal!",
  "Du hast mehr Probleme als mein Code hat Bugs!",
  "Ich habe schon Intelligenteres in einer Petrischale gesehen!",
  "Du bist nicht dumm, du machst nur so!",
];

module.exports = {
  name: 'roast',
  aliases: [],
  description: 'Lasse dich roasten (oder einen anderen User)',
  category: 'fun',
  
  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      
      let response = `🔥 ${randomRoast}`;
      
      // Wenn User erwähnt wird
      if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        const mentionedUser = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        response = `@${mentionedUser.split('@')[0]} 🔥 ${randomRoast}`;
      }
      
      return await sock.sendMessage(from, {
        text: response,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
