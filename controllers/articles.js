const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .select('+owner')
    .then((articles) => {
      res.send(articles.filter((item) => item.owner === req.user._id));
    })
    .catch((err) => next(err));
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findOne({ _id: req.params.articleId }).select('+owner').then((article) => {
    if (!article) {
      throw new NotFoundError('Article not found with that id');
    }
    if (article.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Forbidden');
    }
    return Article.findOneAndDelete(req.params.articleId)
      .then((deletedArticle) => {
        const {
          keyword,
          date,
          text,
          title,
          source,
          link,
          image,
        } = deletedArticle;
        res.send({
          keyword,
          date,
          text,
          title,
          source,
          link,
          image,
        });
      })
      .catch((err) => next(err));
  }).catch((err) => next(err));
};
