'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const routesApi = require(`../api`);

const DEFAULT_PORT = 3000;

const logger = getLogger();

const initServer = async () => {
  const app = express();
  const routes = await routesApi();

  app.use(express.json());
  app.use(API_PREFIX, routes);

  app.use((req, res, next) => {
    logger.debug(`Start request to url ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code: ${res.statusCode}`);
    });

    next();
  });

  app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

  return app;
};

const run = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  const app = await initServer();

  app.listen(port, () => {
    // Регистрируем запуск сервера
    return logger.info(chalk.green(`Ожидаю соединений на ${port}`));
  })
  .on(`error`, (err) => {
    logger.error(`Server can't start. Error: ${err}`);
    process.exit(1);
  });
};

module.exports = {
  name: `--server`,
  run,
  initServer
};
