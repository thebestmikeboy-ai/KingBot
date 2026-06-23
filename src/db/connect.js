const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    logger.info('🔄 Verbindung zu MongoDB wird hergestellt...');
    
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.success('✅ MongoDB erfolgreich verbunden!');
    return mongoose.connection;
  } catch (error) {
    logger.error(`❌ MongoDB Verbindungsfehler: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
