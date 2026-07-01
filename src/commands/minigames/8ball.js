module.exports = {
  name: '8ball',
  aliases: ['eightball', 'magic8'],
  description: 'Magic 8 Ball - stelle eine Frage!',
  category: 'minigames',

  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;

      if (args.length === 0) {
        return await sock.sendMessage(from, {
          text: `🔮 Stelle eine Frage!\n\nBeispiel: ${prefix}8ball Werde ich heute Glück haben?`,
        });
      }

      const question = args.join(' ');
      const answers = [
        'Ja, auf jeden Fall! ✅',
        'Nein, bestimmt nicht! ❌',
        'Vielleicht... 🤔',
        'Frag später nochmal! ⏰',
        'Sehr wahrscheinlich! 🌟',
        'Eher nicht... 😕',
        'Das ist ungewiss 🌀',
        'Absolut! 🔥',
        'Niemals! 🚫',
        'Konzentriere dich und frag nochmal! 💭',
      ];

      const result = answers[Math.floor(Math.random() * answers.length)];

      const eightballText = `
🔮 **MAGIC 8 BALL**

❓ Deine Frage: "${question}"

*Die Kugel rollt...*

✨ **${result}**
      `;

      return await sock.sendMessage(from, {
        text: eightballText,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
