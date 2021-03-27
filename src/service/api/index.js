'use strict';

const {Router} = require(`express`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service/`);


const article = require(`./article`);
const search = require(`./search`);
const category = require(`./category`);

const initRouter = async () => {
  const app = new Router();
  const articleService = new ArticleService();

  category(app, new CategoryService());
  search(app, new SearchService(articleService));
  article(app, articleService, new CommentService());

  return app;
};

module.exports = initRouter;
