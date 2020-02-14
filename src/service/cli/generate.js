'use strict';

const {
  getRandomInt,
  shuffle,
  dateFormat
} = require(`../../utils`);
const chalk = require(`chalk`);

// Подключаем модуль `fs`
const fs = require(`fs`);

const {
  ExitCode
} = require(`../constants`);

const DEFAULT_COUNT = 1;
const COUNT_MAX = 1000;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const ANNOUNCE = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const generatePublications = (count) => {
  const currentDate = new Date();
  const threeMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
  return Array(count).fill({}).map(() => {
      const randomDate = dateFormat((getRandomInt(threeMonthAgo.getTime(), currentDate.getTime())), `%Y-%m-%d %H:%M:%S`);

      return {
        title: TITLES[getRandomInt(0, TITLES.length - 1)],
        announce: shuffle(ANNOUNCE).slice(0, 5).join(` `),
        fullText: shuffle(ANNOUNCE).slice(0, getRandomInt(0, ANNOUNCE.length - 1)).join(` `),
        createdDate: randomDate,
        category: [shuffle(CATEGORIES).slice(0, getRandomInt(0, CATEGORIES.length - 1))],
      };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublication > COUNT_MAX) {
      console.error(chalk.red(`Не больше ${COUNT_MAX} публикаций`));
      return true;
    }

    const content = JSON.stringify(generatePublications(countPublication));

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

