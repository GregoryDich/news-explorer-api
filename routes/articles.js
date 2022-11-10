const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

articlesRouter.get('/articles', getArticles);

articlesRouter.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      image: Joi.string().required().custom(validateURL),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createArticle,
);

articlesRouter.delete(
  '/articles/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().hex(),
    }),
  }),
  deleteArticle,
);

module.exports = articlesRouter;
