'use strict';

const {getRandomInt} = require(`../../utils`);
const getMockData = require(`../lib/get-mock-data`);

const {
  SearchService,
  ArticleService,
} = require(`./`);

let mockData;
let articleService;
let searchService;

beforeEach(async () => {
  mockData = await getMockData();
  articleService = new ArticleService(mockData);
  searchService = new SearchService(mockData);
});

describe(`Methods data-services: SearchService`, () => {
  test(`findAll`, () => {
    const indexArticle = getRandomInt(0, mockData.length - 1);
    const articleIdMock = mockData[indexArticle].id;
    const fragmentTitleMock = mockData[indexArticle].title.substr(0, 6);

    expect(searchService.findAll(fragmentTitleMock).some((article) => article.id === articleIdMock)).toBe(true);
  });
});
