const User = require('../../models/User');
const logger = require('../../utils/logger');

const auras = [
  { color: 'Blutrot', level: 'Mystery', aura: 'Dunkel' },
  { color: 'Goldgelb', level: 'Mystik', aura: 'Hell' },
  { color: 'Tiefblau', level: 'Phantom', aura: 'Kühlig' },
  { color: 'Violett', level: 'Zauberhaft', aura: 'Geheimnisvoll' },
  { color: 'Smaragd', level: 'Natur', aura: 'Lebendig' },
  { color: 'Silber', level: 'Luminous', aura: 'Rein' },
  { color: 'Orange', level: 'Energie', aura: 'Warm' },
  { color: 'Rosa', level: 'Liebe', aura: 'Süß' },
  { color: 'Grau', level: 'Neutral', aura: 'Ausgewogen' },
  { color: 'Schwarz', level: 'Shadow', aura: 'Tiefgründig' },
];

module.exports = {
  name: 'myaura',
  aliases: ['aura', 'meine_aura'],
  description: 'Ziehe eine zufällige Aura',
  category: 'profile',

  async execute({ sock, message, args, prefix }) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;

      const user = await User.findOne({ phoneNumber: sender });

      if (!user || !user.registered) {
        return await sock.sendMessage(from, {
          text: `❌ Du bist nicht registriert!`,
        });
      }

      // Check Cooldown (24h)
      if (user.lastAuraSet) {
        const now = new Date();
        const lastAura = new Date(user.lastAuraSet);
        const diffHours = (now - lastAura) / (1000 * 60 * 60);

        if (diffHours < 24) {
          const remainingHours = Math.ceil(24 - diffHours);
          return await sock.sendMessage(from, {
            text: `⏳ Du kannst erst in ${remainingHours} Stunden eine neue Aura ziehen!\n\n🌟 Aktuelle Aura:\nFarbe: ${user.currentAura?.color}\nStufe: ${user.currentAura?.level}\nAusstrahlung: ${user.currentAura?.aura}`,
          });
        }
      }

      const newAura = auras[Math.floor(Math.random() * auras.length)];
      user.currentAura = newAura;
      user.lastAuraSet = new Date();
      await user.save();

      const auraText = `
🌟 **NEUE AURA GEZOGEN!**\n\n💩 Farbe: ${newAura.color}\n🌌 Stufe: ${newAura.level}\n✨ Ausstrahlung: ${newAura.aura}\n\nZum nächsten Mal: in 24h ⏳
      `;

      return await sock.sendMessage(from, {
        text: auraText,
      });
    } catch (error) {
      logger.error(`Fehler in myaura command: ${error.message}`);
    }
  },
};
