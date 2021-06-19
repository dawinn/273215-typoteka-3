'use strict';
const csrf = require(`csurf`);
const csrfProtection = csrf({cookie: true});

module.exports = (req, res, next) => {
  return csrfProtection(req, res, () => {
    res.locals._csrf = req.csrfToken();
    next();
  });
};
