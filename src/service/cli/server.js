'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const app = express();
const fs = require(`fs`).promises;

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const onClientConnect = async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
    res.send(JSON.parse(fileContent));
      } catch (err) {
    res.send([]);
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port).on(`listening`, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
    app.get(`/posts`, onClientConnect);
  }
};
