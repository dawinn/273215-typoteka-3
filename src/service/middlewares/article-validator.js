'use strict';

const {HttpCode} = require(`../../constants`);
const logger = require(`../lib/logger`);

const articleKeys = [`category`, `picture`, `title`, `announce`, `fullText`, `createdDate`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (keysExists) {
    next();
  } else {
    logger.error(`Error validation: ${JSON.stringify(newArticle)}`);
    res.status(HttpCode.BAD_REQUEST)
    .send(`Bad request: validation error.`);
  }
};
