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

const app = new Router();

(async () => {
  const getMockData = require(`../lib/get-mock-data`);
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService());
})();

module.exports = app;
