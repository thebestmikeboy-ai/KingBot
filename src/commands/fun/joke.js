const jokes = [
  "Warum ist das Ei übergelaufen? Weil es nicht gesessen hat! 🥚",
  "Wie heißt ein Boomerang, der nicht zurückkommt? Stock! 🪵",
  "Was ist grün und piept? Ein angemalter Pieper! 🟢",
  "Warum gehen Fische niemals ins Fitnessstudio? Sie haben Angst vor Netzen! 🐟",
  "Was ist rot und riecht nach Pinseln? Farbe! 🎨",
];

module.exports = {
  name: 'joke',
  aliases: [],
  description: 'Höre einen zufälligen Witz',
  category: 'fun',
  
  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      
      return await sock.sendMessage(from, {
        text: `😂 ${randomJoke}`,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
