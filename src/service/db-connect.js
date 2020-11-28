'use strict';
const logger = require(`./lib/logger`);
const Env = require(`./get-environments`);
const Sequelize = require(`sequelize`);

const sequelize = new Sequelize(Env.DB_NAME, Env.DB_LOGIN, Env.DB_PASSWORD, {
  host: Env.DB_HOST,
  dialect: Env.DB_DIALECT,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`Соединение с сервером БД установлено!`);
    return sequelize;
  } catch (err) {
    logger.error(`Не удалось установить соединение по причине: ${err}`);
    process.exit(1);
    return null;
  }
};

const close = () => {
  sequelize.close();
};

module.exports = {
  connect,
  close,
  sequelize,
};
