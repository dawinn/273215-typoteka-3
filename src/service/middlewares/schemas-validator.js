'use strict';
const {HttpCode} = require(`../../constants`);

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;

    try {
      await schema.validateAsync(body, {abortEarly: false, dateFormat: `string`});
    } catch (err) {
      const {details} = err;
      res.status(HttpCode.BAD_REQUEST).json({
        message: details.reduce((obj, errorDescription) => {
          obj[errorDescription.context.key] = errorDescription.message;
          return obj;
        }, {}),
        data: body
      });
      return;
    }

    next();
  }
);


