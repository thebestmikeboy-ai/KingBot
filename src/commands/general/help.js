module.exports = {
  name: 'help',
  aliases: [],
  description: 'Zeige eine Übersicht der Befehle',
  category: 'general',
  
  async execute({ sock, message, args, prefix }) {
    try {
      const from = message.key.remoteJid;
      
      const helpText = `
╔═══════════════════════════════════╗
║        🤖 KingBot - Hilfe        ║
╚═══════════════════════════════════╝

📋 **Profil & Account:**
${prefix}dsgvo - Zeige DSGVO Richtlinien
${prefix}accept - Akzeptiere Richtlinien
${prefix}register [username] [tt.mm.jjjj] - Registriere dich
${prefix}profile - Zeige dein Profil
${prefix}level - Zeige Level & XP

🎮 **Spaß & Spiele:**
${prefix}joke - Zufälliger Witz
${prefix}roast [optional @user] - Roast
${prefix}coinflip - Münzwurf
${prefix}dice - Würfel

💰 **Economy:**
${prefix}balance - Zeige Guthaben
${prefix}daily - Tägliche Belohnung
${prefix}work - Arbeite für Cash

❓ **Mehr Infos:**
${prefix}menu [zahl] - Zeige Command-Menü
${prefix}support [text] - Sende Support-Nachricht
      `;
      
      return await sock.sendMessage(from, {
        text: helpText,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
