'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemas = require(`../middlewares/schemas-validate`);
const registerValidator = require(`../middlewares/schemas-validator`)(schemas.user);
const alreadyRegisterValidator = require(`../middlewares/already-register`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, [
    registerValidator,
    alreadyRegisterValidator(userService),
  ], async (req, res) => {
    try {
      const user = await userService.create(req.body);
      return res.status(HttpCode.CREATED)
      .json(user);
    } catch (error) {
      return res.status(HttpCode.BAD_REQUEST)
      .json({
        message: error.message,
        data: req.body
      });
    }
  });
};
