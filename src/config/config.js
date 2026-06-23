require('dotenv').config();

module.exports = {
  BOT_PREFIX: process.env.BOT_PREFIX || 'X',
  BOT_NAME: process.env.BOT_NAME || 'KingBot',
  OWNER_NUMBER: process.env.OWNER_NUMBER,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/kingbot',
  SESSION_DIR: process.env.SESSION_DIR || './sessions',
  
  // Feature Toggles
  FEATURES: {
    RPG: process.env.ENABLE_RPG === 'true',
    ECONOMY: process.env.ENABLE_ECONOMY === 'true',
    LEVELING: process.env.ENABLE_LEVELING === 'true',
  },

  // XP Konfiguration
  XP: {
    MESSAGE: 5,
    COMMAND: 7,
    LEAGUE_UP_BONUS: 50,
    CHALLENGE_COMPLETE: 10,
  },

  // Liga-System
  LEAGUES: [
    'Anfänger',
    'Entdecker',
    'Fortgeschritten',
    'Profi',
    'Bronze',
    'Silber',
    'Gold',
    'Chromium',
    'Amethyst',
    'Kristall',
    'Mystisch',
    'Episch',
    'Diamant',
  ],

  LEAGUE_TIERS: ['I', 'II', 'III'],
  LEVELS_PER_TIER: 25,
  TIERS_PER_LEAGUE: 3,
};
