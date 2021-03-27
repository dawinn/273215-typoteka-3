'use strict';

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

const {
  Category,
  User,
} = require(`../models`);
const dbConnection = require(`../db-connect`);

const {
  CommentService,
  ArticleService,
} = require(`../data-service`);

let articleService = new ArticleService();
let commentService = new CommentService();

const {
  MAX_COMMENTS,
  PictureRestrict,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;

const usersList = [
  {
    'email': `nov@mail.ru`,
    'password': `god`,
    'name': `Амфибрахий`,
    'surname': `Новиков`,
  },
  {
    'email': `pet@ya.ru`,
    'password': `evil`,
    'name': `Владилен`,
    'surname': `Феликс`,
  }
];

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const getPictureFileName = (number) => {
  const numWithLead0 = `${printNumWithLead0(number)}`;
  return `item${numWithLead0}.jpg`;
};

const generateData = (count, titles, categories, sentences, comments) => {

  const articles = Array(count).fill({}).map(() => {

    const articleDate = getRandomDate();
    /* генерируем комментарии поста */
    const commentList = Array(getRandomInt(1, MAX_COMMENTS)).fill({}).map(() => ({
      'text': shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
      'created': dateFormat(getRandomDate(articleDate), `%Y-%m-%d %H:%M:%S`),
    }));

    return {
      'comments': commentList,
      'picture': getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      'title': titles[getRandomInt(0, titles.length - 1)],
      'announce': shuffle(sentences).slice(0, 5).join(` `).substr(0, 400),
      'fullText': shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
      'category': shuffle(categories).slice(1, getRandomInt(0, categories.length - 1)),
    };
  });

  return articles;
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      await dbConnection.connect();
      // Считываем контент из файлов
      const sentences = await readContentFile(FILE_SENTENCES_PATH);
      const titles = await readContentFile(FILE_TITLES_PATH);
      const categories = await readContentFile(FILE_CATEGORIES_PATH);
      const comments = await readContentFile(FILE_COMMENTS_PATH);

      const [count] = args;
      const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
      if (countArticle > COUNT_MAX) {
        return true;
      }
      const articles = generateData(countArticle, titles, categories, sentences, comments, usersList);

      const userList = await User.bulkCreate(usersList);
      await Category.bulkCreate(categories.map((name) => ({name})));

      await Promise.all(articles.map(async (article) => {
        const newArticle = await articleService.create(article);

        if (!newArticle.id) {
          /* кажется этот пост не хочет быть в БД */
          return;
        }

        await Promise.all(article.comments.map(async (comment) =>{
          const userId = userList[getRandomInt(0, userList.length - 1)].toJSON().id;
          await commentService.create(newArticle.id, {...comment, userId});
        }));

      }));

      logger.info(chalk.green(`Operation fill DB success.`));
    } catch (err) {
      logger.error(chalk.red(`Can't write data to DB...
      ${err}`));
    }
    dbConnection.close();
    return true;
  }
};

