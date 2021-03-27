'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  offerId: Joi.number()
  .min(1),

  commentId: Joi.number()
  .min(1),
});
