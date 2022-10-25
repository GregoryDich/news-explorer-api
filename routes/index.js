const appRouter = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');

appRouter.use(usersRouter);
appRouter.use(articlesRouter);
module.exports = appRouter;
