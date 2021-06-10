'use strict';

const {Router} = require(`express`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
} = require(`../data-service/`);


const article = require(`./article`);
const search = require(`./search`);
const category = require(`./category`);
const user = require(`./user`);

const initRouter = async () => {
  const app = new Router();
  const articleService = new ArticleService();

  category(app, new CategoryService());
  search(app, new SearchService(articleService));
  article(app, articleService, new CommentService());
  user(app, new UserService());

  return app;
};

module.exports = initRouter;
