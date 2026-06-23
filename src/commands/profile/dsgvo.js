module.exports = {
  name: 'dsgvo',
  aliases: [],
  description: 'Zeige die DSGVO Richtlinien',
  category: 'profile',
  
  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      
      const dsgvoText = `
╔═══════════════════════════════════╗
║  📜 DSGVO & NUTZUNGSRICHTLINIEN  ║
╚═══════════════════════════════════╝

🔒 **Datenschutz:**
Wir speichern deine Daten nach DSGVO Standards. Deine Telefonnummer wird verschlüsselt gespeichert und nicht an Dritte weitergegeben.

📱 **Gespeicherte Daten:**
- Telefonnummer (Identifikation)
- Benutzername
- Geburtsdatum
- Profileinformationen
- Spielstatistiken

🛡️ **Deine Rechte:**
- Recht auf Einsicht (${prefix}mydata)
- Recht auf Löschung (${prefix}forgetme)
- Recht auf Widerspruch
- Recht auf Datenportabilität

⚠️ **Wichtig:**
Durch die Nutzung dieses Bots akzeptierst du, dass deine Daten gespeichert und verarbeitet werden.

✅ Um fortzufahren, nutze:
${prefix}accept
      `;
      
      return await sock.sendMessage(from, {
        text: dsgvoText,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
