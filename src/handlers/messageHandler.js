const config = require('../config/config');
const commandHandler = require('./commandHandler');
const logger = require('../utils/logger');
const User = require('../models/User');

const handleMessage = async (sock, message) => {
  try {
    if (!message.message) return;

    const messageText = message.message.conversation || 
                       message.message.extendedTextMessage?.text || '';
    const from = message.key.remoteJid;
    const isGroup = from?.endsWith('@g.us');
    const sender = message.key.fromMe ? sock.user.id : message.key.participant || from;

    if (message.key.fromMe) return;

    // Nachricht nicht vom Bot
    if (!messageText) return;

    // Prefix-Check
    const prefix = config.BOT_PREFIX.toLowerCase();
    if (!messageText.toLowerCase().startsWith(prefix)) {
      // XP für normale Nachrichten vergeben
      if (!isGroup) return; // DMs zählen nicht
      await addMessageXP(sender, from);
      return;
    }

    // Command verarbeiten
    const args = messageText.slice(prefix.length).trim().split(/\s+/);
    if (args.length === 0) return;

    logger.info(`[${isGroup ? 'GROUP' : 'DM'}] ${sender}: ${messageText}`);

    // Check ob User registriert ist (außer für DSGVO und Accept Commands)
    const user = await User.findOne({ phoneNumber: sender });
    const exemptCommands = ['dsgvo', 'accept'];
    
    if (!user && !exemptCommands.includes(args[0].toLowerCase())) {
      return await sock.sendMessage(from, {
        text: `❌ Du musst dich erst registrieren!\n\nNutze ${prefix}accept um unsere Richtlinien zu akzeptieren.\nDann ${prefix}register [benutzername] [tt.mm.jjjj]`,
      });
    }

    // Command ausführen
    const success = await commandHandler.execute(sock, message, prefix, args);
    
    if (success && user) {
      // XP für Command vergeben
      await addCommandXP(sender);
    }
  } catch (error) {
    logger.error(`Fehler bei Message Handler: ${error.message}`);
  }
};

const addMessageXP = async (sender, groupId) => {
  try {
    await User.findOneAndUpdate(
      { phoneNumber: sender },
      { $inc: { xp: 5 } },
      { new: true }
    );
  } catch (error) {
    logger.error(`Fehler beim Hinzufügen von Message XP: ${error.message}`);
  }
};

const addCommandXP = async (sender) => {
  try {
    const user = await User.findOneAndUpdate(
      { phoneNumber: sender },
      { $inc: { xp: 7 } },
      { new: true }
    );
    // Hier könnte Liga-Check stattfinden
  } catch (error) {
    logger.error(`Fehler beim Hinzufügen von Command XP: ${error.message}`);
  }
};

module.exports = { handleMessage, addMessageXP, addCommandXP };
