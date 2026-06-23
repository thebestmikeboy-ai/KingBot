const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toLocaleString('de-DE');
};

module.exports = {
  info: (message) => {
    console.log(chalk.blue(`[INFO] ${getTimestamp()} - ${message}`));
  },
  success: (message) => {
    console.log(chalk.green(`[SUCCESS] ${getTimestamp()} - ${message}`));
  },
  warn: (message) => {
    console.log(chalk.yellow(`[WARN] ${getTimestamp()} - ${message}`));
  },
  error: (message) => {
    console.log(chalk.red(`[ERROR] ${getTimestamp()} - ${message}`));
  },
};
