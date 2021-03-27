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
const fs = require(`fs`).promises;

const {
  MAX_COMMENTS,
  PictureRestrict,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;
const FILE_NAME = `fill-db.sql`;

const usersList = [
  {
    'id': `1`,
    'email': `nov@mail.ru`,
    'password': `god`,
    'name': `Амфибрахий`,
    'surname': `Новиков`,
  },
  {
    'id': `2`,
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

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
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

const generateData = (count, titles, categories, sentences, comments, users) => {
  const articlesCategories = [];
  const articlesComments = [];
  const pictures = [];

  const articles = Array(count).fill({}).map((_, index) => {
    const articleId = index + 1;
    /* добавляем категории объявления */
    shuffle(categories).slice(1, getRandomInt(0, categories.length - 1))
    .forEach((__, categoryIndex) => {
      articlesCategories.push({
        'id': articlesCategories.length + 1,
        'article_id': articleId,
        'category_id': categoryIndex + 1,
      });
    });
    /* генерируем картинки и сохраняем для формирования строк таблицы */
    const picturyId = pictures.push(Object.assign({'id': pictures.length + 1}, getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))));

    const articleDate = getRandomDate();
    /* генерируем комментарии поста */
    generateComments(getRandomInt(1, MAX_COMMENTS), comments).forEach((comment) => {
      articlesComments.push({
        'id': articlesComments.length + 1,
        'article_id': articleId,
        'text': comment.text,
        'user_id': users[getRandomInt(0, users.length - 1)].id,
        'created': dateFormat(getRandomDate(articleDate), `%Y-%m-%d %H:%M:%S`),
      });
    });

    return {
      'id': articleId,
      'picture_id': picturyId,
      'title': titles[getRandomInt(0, titles.length - 1)],
      'announce': shuffle(sentences).slice(0, 5).join(` `),
      'full_text': shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
      'create_date': dateFormat(articleDate, `%Y-%m-%d %H:%M:%S`),
      'updated': dateFormat(articleDate, `%Y-%m-%d %H:%M:%S`),
    };
  });

  return {
    articles,
    articlesCategories,
    articlesComments,
    pictures,
  };
};

const generateFillTableScript = (tableName, data) => {
  return `
insert into ${tableName}(${Object.keys(data[0]).join(`,`)}) values
${data.map((row) => `(${Object.values(row).map((v) => `'${v}'`).join(`,`)})`).join(`,`)};
alter sequence public.${tableName}_id_seq restart with ${data.length + 1};
 `;
};
module.exports = {
  name: `--fill`,
  async run(args) {
    // Считываем контент из файлов
    const sentences = await readContentFile(FILE_SENTENCES_PATH);
    const titles = await readContentFile(FILE_TITLES_PATH);
    const categories = await readContentFile(FILE_CATEGORIES_PATH);
    const comments = await readContentFile(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countArticle > COUNT_MAX) {
      logger.error(chalk.red(`Не больше ${COUNT_MAX} объявлений`));
      return true;
    }
    const {
      articles,
      articlesCategories,
      articlesComments,
      pictures,
    } = generateData(countArticle, titles, categories, sentences, comments, usersList);

    const content = `
/* список пользователей */${generateFillTableScript(`users`, usersList)}
/* справочник категорий */${generateFillTableScript(`categories`, categories.map((name, id) => ({id: id + 1, name})))}
/* справочник картинок */${generateFillTableScript(`pictures`, pictures)}
/* список объявлений */${generateFillTableScript(`articles`, articles)}
/* категории объявлений */${generateFillTableScript(`articles_categories`, articlesCategories)}
/* справочник категорий */${generateFillTableScript(`comments`, articlesComments)}
    `;

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      logger.error(chalk.red(`Can't write data to file...`));
    }
    return true;
  }
};

