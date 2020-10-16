'use strict';

const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);
const logger = require(`../lib/logger`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    logger.info(chalk.blue(version));
  }
};
