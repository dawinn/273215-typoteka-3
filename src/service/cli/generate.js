'use strict';

const {nanoid} = require(`nanoid`);
const logger = require(`../lib/logger`);

const {
  getRandomInt,
  shuffle,
  dateFormat,
  getRandomDate,
  printNumWithLead0,
  readContentFile,
} = require(`../../utils`);
const chalk = require(`chalk`);

// Подключаем модуль `fs`
const fs = require(`fs`).promises;

const {
  ExitCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  PictureRestrict,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
    .slice(0, getRandomInt(1, 3))
    .join(` `),
  }))
);

const getPictureFileName = (number) => {
  const numWithLead0 = `${printNumWithLead0(number)}`;
  return {
    background: numWithLead0,
    image: `item${numWithLead0}.jpg`,
    image2x: `item${numWithLead0}@2x.jpg`
  };
};

const generatePublications = (count, titles, categories, sentences, comments) => {
  return Array(count).fill({}).map(() => {
    const randomDate = getRandomDate();

    return {
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
      picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      announce: shuffle(sentences).slice(0, 5).join(` `),
      fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
      createdDate: dateFormat(randomDate, `%Y-%m-%d %H:%M:%S`),
      category: shuffle(categories).slice(1, getRandomInt(0, categories.length - 1)),
    };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContentFile(FILE_SENTENCES_PATH);
    const titles = await readContentFile(FILE_TITLES_PATH);
    const categories = await readContentFile(FILE_CATEGORIES_PATH);
    const comments = await readContentFile(FILE_COMMENTS_PATH);
    const [count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublication > COUNT_MAX) {
      logger.error(chalk.red(`Не больше ${COUNT_MAX} публикаций`));
      return true;
    }

    const content = JSON.stringify(generatePublications(countPublication, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      logger.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.error);
    }

    return true;
  }
};

