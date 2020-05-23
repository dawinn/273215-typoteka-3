'use strict';

const {nanoid} = require(`nanoid`);
const {
  getRandomInt,
  shuffle,
  dateFormat
} = require(`../../utils`);
const chalk = require(`chalk`);

// Подключаем модуль `fs`
const fs = require(`fs`).promises;

const {
  ExitCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
    .slice(0, getRandomInt(1, 3))
    .join(` `),
  }))
);

const generatePublications = (count, titles, categories, sentences, comments) => {
  const currentDate = new Date();
  const threeMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
  return Array(count).fill({}).map(() => {
      const randomDate = dateFormat((getRandomInt(threeMonthAgo.getTime(), currentDate.getTime())), `%Y-%m-%d %H:%M:%S`);

      return {
        id: nanoid(MAX_ID_LENGTH),
        title: titles[getRandomInt(0, titles.length - 1)],
        comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
        announce: shuffle(sentences).slice(0, 5).join(` `),
        fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
        createdDate: randomDate,
        category: [categories[getRandomInt(0, categories.length - 1)]],
      };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublication > COUNT_MAX) {
      console.error(chalk.red(`Не больше ${COUNT_MAX} публикаций`));
      return true;
    }

    const content = JSON.stringify(generatePublications(countPublication, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch  (err) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.error);
    }

    return true;
  }
};

