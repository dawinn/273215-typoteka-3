'use strict';
const {getLogger} = require(`./service/lib/logger`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const dateFormat = (dateTime, strFormat) => {
  const date = new Date();
  date.setTime(dateTime);
  return strFormat.replace(/%[YmdHMS]/g, (match) => {
    switch (match) {
      case `%Y`: return date.getFullYear();
      case `%m`: match = 1 + date.getMonth(); break;
      case `%d`: match = date.getDate(); break;
      case `%H`: match = date.getHours(); break;
      case `%M`: match = date.getMinutes(); break;
      case `%S`: match = date.getSeconds(); break;
      default: return match.slice(1);
    }
    // добавим лидирующие нули
    return (`0` + match).slice(-2);
  });
};

const getRandomDate = (deadline) => {
  const currentDate = new Date();
  if (deadline) {
    currentDate.setTime(deadline);
  }
  const threeMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
  return getRandomInt(threeMonthAgo.getTime(), currentDate.getTime());
};

const readContentFile = async (filePath) => {
  const logger = getLogger();
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).filter((str) => str.length > 0);
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

const printNumWithLead0 = (number) => number < 10 ? `0${number}` : number;

module.exports = {
  getRandomInt,
  shuffle,
  dateFormat,
  getRandomDate,
  readContentFile,
  printNumWithLead0,
};
