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
  const getMockData = require(`../lib/get-mock-data`);
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService());

  return app;
};

module.exports = initRouter;
