'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  text: Joi.string()
  .min(10)
  .max(1000)
  .required()
  .messages({
    'string.empty': `{#label} не должно быть пустым`,
    'string.min': `{#label} по длине должно быть более {#limit} символов`,
    'string.max': `{#label} по длине не должно превышать {#limit} символов`,
    'any.required': `{#label} не должно быть пустым`
  })
  .label(`Текст комментария`),
});
