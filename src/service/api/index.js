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

  category(app, new CategoryService());
  search(app, new SearchService());
  article(app, new ArticleService(), new CommentService());

  return app;
};

module.exports = initRouter;
