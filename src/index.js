const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const chalk = require('chalk');
const mongoose = require('mongoose');
require('dotenv').config();

const config = require('./config/config');
const logger = require('./utils/logger');
const connectDB = require('./db/connect');
const { handleMessage } = require('./handlers/messageHandler');

let sock;

const startBot = async () => {
  try {
    logger.info(`\n🤖 ${config.BOT_NAME} wird gestartet...\n`);

    // Verbinde zu MongoDB
    await connectDB();

    const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: Browsers.ubuntu('Chrome'),
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'connecting') {
        logger.info('📱 Verbindung wird hergestellt...');
      } else if (connection === 'open') {
        logger.success(`\n✅ ${config.BOT_NAME} erfolgreich verbunden!\n`);
        logger.info(`🎯 Präfix: ${config.BOT_PREFIX}`);
      } else if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        logger.error(`\n❌ Verbindung getrennt. Grund: ${lastDisconnect?.error}`);

        if (shouldReconnect) {
          logger.warn('🔄 Versuche erneut zu verbinden...');
          setTimeout(() => startBot(), 3000);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
      try {
        await handleMessage(sock, m.messages[0]);
      } catch (error) {
        logger.error(`❌ Fehler bei Nachrichtenverarbeitung: ${error.message}`);
      }
    });
  } catch (error) {
    logger.error(`❌ Fehler beim Starten des Bots: ${error.message}`);
    process.exit(1);
  }
};

startBot();

process.on('SIGINT', () => {
  logger.warn('\n👋 Bot wird beendet...');
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
  process.exit(0);
});
