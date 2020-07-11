'use strict';

const {getRandomInt} = require(`../../utils`);
const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  ArticleService,
} = require(`./`);

let mockData;
let articleService;
let categoryService;

beforeEach(async () => {
  mockData = await getMockData();
  articleService = new ArticleService(mockData);
  categoryService = new CategoryService(mockData);
});


describe(`Methods data-services: CategoryService`, () => {
  test(`test category link to article`, () => {
    expect(JSON.stringify(articleService)).toEqual(JSON.stringify(categoryService));
  });

  test(`findAll`, () => {
    const indexArticle = getRandomInt(0, mockData.length - 1);
    const categoriesMock = mockData[indexArticle].category;
    const allCategories = categoryService.findAll();
    expect(categoriesMock.every((category) => allCategories.includes(category))).toBe(true);
  });
});
