'use strict';

const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);

module.exports = {
  name: `--version`,
  run() {
    const logger = getLogger();
    const version = packageJsonFile.version;
    logger.info(chalk.blue(version));
  }
};
