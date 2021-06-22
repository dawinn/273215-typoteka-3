'use strict';

const {HttpCode} = require(`../../constants`);
const {sendData} = require(`../request`);

module.exports = async (req, res, next) => {
  const {userEmail, userPassword} = req.body;
  const response = await sendData(`/api/user/login`, {
    username: userEmail,
    password: userPassword,
  });

  if (!response.statusCode || response.statusCode === HttpCode.OK) {
    req.session.user = response.user;
  }

  if (response.statusCode) {
    res.locals.errors = response.error;
  }

  return next();
};
