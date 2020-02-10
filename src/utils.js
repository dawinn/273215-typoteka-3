'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.dateFormat = (dateTime, strFormat) => {
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
      default: return match.slice (1);
    }
    // добавим лидирующие нули
    return ('0' + match).slice (-2);
  });
};
