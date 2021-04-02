'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
  .min(10)
  .max(100)
  .required()
  .messages({
    'string.empty': `{#label} не должно быть пустым`,
    'string.min': `{#label} по длине должно быть более {#limit} символов`,
    'string.max': `{#label} по длине не должно превышать {#limit} символов`,
    'any.required': `{#label} не должно быть пустым`
  })
  .label(`Заголовок`),

  announce: Joi.string()
  .min(50)
  .max(1000)
  .required()
  .messages({
    'string.empty': `{#label} не должно быть пустым`,
    'string.min': `{#label} по длине должно быть более {#limit} символов`,
    'string.max': `{#label} по длине не должно превышать {#limit} символов`,
    'any.required': `{#label} не должно быть пустым`
  })
  .label(`Анонс публикации`),

  fullText: Joi.string()
  .min(50)
  .max(8000)
  .required()
  .messages({
    'string.empty': `{#label} не должно быть пустым`,
    'string.min': `{#label} по длине должно быть более {#limit} символов`,
    'string.max': `{#label} по длине не должно превышать {#limit} символов`,
    'any.required': `{#label} не должно быть пустым`
  })
  .label(`Полный текст публикации`),

  createdDate: Joi.date()
  .label(`Дата публикации`)
  .message(`должна быть валидной`),

  category: Joi.array().items(Joi.object({
    id: Joi.number(),
    name: Joi.string(),
  }))
  .label(`Анонс публикации`),

  picture: Joi.string()
  .required()
  .messages({
    'string.empty': `{#label} не должно быть пустым`,
    'any.required': `{#label} не должно быть пустым`
  })
  .label(`Фотография`),

  comments: Joi.array()
  .label(`Комментарии`),
});
