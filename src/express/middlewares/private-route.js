'use strict';

module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.render(`login`);
  }

  return next();
};
