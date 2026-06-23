module.exports = {
  name: 'dice',
  aliases: ['würfel', 'roll'],
  description: 'Würfle eine Zahl von 1-6',
  category: 'minigames',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      const result = Math.floor(Math.random() * 6) + 1;
      const emojis = ['❌', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

      const diceText = `
🎲 **WÜRFEL**

*würfelt...*

${emojis[result]} Du hast eine **${result}** gewürfelt!
      `;

      return await sock.sendMessage(from, {
        text: diceText,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
