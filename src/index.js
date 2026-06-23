const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const chalk = require('chalk');
require('dotenv').config();

const BOT_PREFIX = process.env.BOT_PREFIX || 'X';
const BOT_NAME = process.env.BOT_NAME || 'KingBot';

let sock;

const startBot = async () => {
  try {
    console.log(chalk.blue(`\n🤖 ${BOT_NAME} wird gestartet...\n`));

    const { state, saveCreds } = await useMultiFileAuthState('sessions');

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: Browsers.ubuntu('Chrome'),
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'connecting') {
        console.log(chalk.yellow('📱 Verbindung wird hergestellt...'));
      } else if (connection === 'open') {
        console.log(chalk.green(`\n✅ ${BOT_NAME} erfolgreich verbunden!\n`));
      } else if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(chalk.red(`\n❌ Verbindung getrennt. Grund: ${lastDisconnect?.error}`));

        if (shouldReconnect) {
          console.log(chalk.yellow('🔄 Versuche erneut zu verbinden...'));
          startBot();
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
      try {
        const message = m.messages[0];

        if (!message.message) return;

        const messageText = message.message.conversation || message.message.extendedTextMessage?.text || '';
        const from = message.key.remoteJid;
        const isGroup = from?.endsWith('@g.us');
        const sender = message.key.fromMe ? sock.user.id : message.key.participant || from;

        if (message.key.fromMe) return;

        // Beispiel: Echo für Bot-Antworten
        if (messageText.toLowerCase().startsWith(BOT_PREFIX.toLowerCase())) {
          console.log(chalk.cyan(`\n[${isGroup ? 'GRUPPE' : 'DM'}] ${sender}: ${messageText}`));
          // Commands werden hier verarbeitet
        }
      } catch (error) {
        console.error(chalk.red('❌ Fehler bei Nachrichtenverarbeitung:'), error);
      }
    });
  } catch (error) {
    console.error(chalk.red('❌ Fehler beim Starten des Bots:'), error);
    process.exit(1);
  }
};

startBot();

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Bot wird beendet...'));
  process.exit(0);
});
