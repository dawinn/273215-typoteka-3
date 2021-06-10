'use strict';

const Joi = require(`joi`);
const {
  RegisterMessage,
  MIN_PASSWORD_LENGTH
} = require(`../../../constants`);

module.exports = Joi.object({

  email: Joi.string()
  .required()
  .email()
  .messages({
    'string.email': RegisterMessage.WRONG_EMAIL,
    'any.required': RegisterMessage.REQUIRED_FIELD,
  }),


  password: Joi.string()
  .required()
  .min(MIN_PASSWORD_LENGTH)
  .messages({
    'string.min': RegisterMessage.MIN_PASSWORD_LENGTH,
    'any.required': RegisterMessage.REQUIRED_FIELD,
  }),

  repeat: Joi.string()
  .required()
  .valid(Joi.ref(`password`))
  .messages({
    'any.only': RegisterMessage.PASSWORDS_NOT_EQUALS,
    'any.required': RegisterMessage.REQUIRED_FIELD,
  }),



  name: Joi.string()
  .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/)
  .min(1)
  .max(255)
  .required(),

  surname: Joi.string()
  .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/)
  .min(1)
  .max(255)
  .required(),

  avatar: Joi.string(),
});
