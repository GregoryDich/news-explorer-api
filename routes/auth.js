const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { login, registerUser } = require('../controllers/auth');

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.email');
};

authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
}), registerUser);

authRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().required(),
    }),
  }),
  login,
);

module.exports = authRouter;
