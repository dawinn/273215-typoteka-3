'use strict';
const {HttpCode} = require(`../../constants`);
const {param, validationResult} = require(`express-validator`);

module.exports = (value) => (
  async (req, res, next) => {
    await param(value)
      .exists()
      .toInt()
      .isInt()
      .run(req);

    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      return res.status(HttpCode.BAD_REQUEST)
      .send(`Некорректное значение параметра ${value}`);
    }
  }
);
