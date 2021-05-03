'use strict';
const {
  HttpCode,
  RegisterMessage
} = require(`../../constants`);

module.exports = (store) => (
  async (req, res, next) => {
    const {email} = req.body;
    const user = await store.findByEmail(email);
    if (user) {
      res.status(HttpCode.BAD_REQUEST).json({
        message: [RegisterMessage.USER_ALREADY_REGISTER],
        data: req.body
      });
      return;
    }

    next();
  }
);
