module.exports = {
  name: 'coinflip',
  aliases: ['coin'],
  description: 'Münzwurf - Kopf oder Zahl?',
  category: 'minigames',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      const choices = ['Kopf 🪙', 'Zahl 🪙'];
      const result = choices[Math.floor(Math.random() * 2)];

      const coinflipText = `
🪙 **MÜNZWURF**

*wirft Münze...*

✨ Das Ergebnis ist: **${result}**
      `;

      return await sock.sendMessage(from, {
        text: coinflipText,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
