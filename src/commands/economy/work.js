const User = require('../../models/User');
const logger = require('../../utils/logger');

const jobs = [
  { name: 'Burger flippen', reward: 50, emoji: '🍔' },
  { name: 'Code schreiben', reward: 150, emoji: '💻' },
  { name: 'Babysitting', reward: 75, emoji: '👶' },
  { name: 'Gras mähen', reward: 60, emoji: '🚜' },
  { name: 'Tutoring', reward: 120, emoji: '📚' },
  { name: 'Pizza ausliefern', reward: 80, emoji: '🍕' },
  { name: 'Hunde ausführen', reward: 70, emoji: '🐕' },
  { name: 'Webdesign', reward: 200, emoji: '🎨' },
];

module.exports = {
  name: 'work',
  aliases: [],
  description: 'Arbeite um Cash zu verdienen',
  category: 'economy',

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

      // Zufälligen Job wählen
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const bonus = Math.random() > 0.7 ? Math.floor(job.reward * 0.5) : 0;
      const totalReward = job.reward + bonus;

      user.wallet += totalReward;
      user.xp += 7; // XP für Command
      await user.save();

      let workText = `
${job.emoji} **${job.name}**

✅ Du hast ${job.name} abgeschlossen!
💰 Verdient: $${totalReward}`;

      if (bonus > 0) {
        workText += `
🎁 Bonus: +$${bonus}`;
      }

      workText += `

👛 Neuer Kontostand: $${user.wallet}
      `;

      return await sock.sendMessage(from, {
        text: workText,
      });
    } catch (error) {
      logger.error(`Fehler in work command: ${error.message}`);
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ein Fehler ist aufgetreten!`,
      });
    }
  },
};
