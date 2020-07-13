'use strict';

const {getRandomInt} = require(`../../utils`);
const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  CommentService,
  SearchService,
  ArticleService,
} = require(`./`);

let mockData;
let articleService;
let categoryService;
let searchService;
let commentService;

beforeEach(async () => {
  mockData = await getMockData();
  articleService = new ArticleService(mockData);
  categoryService = new CategoryService(mockData);
  searchService = new SearchService(mockData);
  commentService = new CommentService();
});

const newArticle = {
  "title": `Новый элемент`,
  "comments": [],
  "announce": `Аннотация к новому элементу`,
  "fullText": `Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться и искать! Найти и... перепрятать Однажды тихой тёмной ночью... Или как-то раз мы с друзьями заблудились с пятнички на воскресенье Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. `,
  "createdDate": `2020-03-18 15:07:18`,
  "category": [`Деревья`]
  };

describe(`Methods data-services: ArticleService`, () => {
  test(`findAll:`, () => {
    const articles = articleService.findAll();
    expect(articles).toStrictEqual(mockData);
  });

  test(`add new article`, () => {
    const originalLengthMockData = mockData.length;
    const article = articleService.create(newArticle);
    expect(article).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        announce: expect.any(String),
        createdDate: expect.any(String),
        comments: expect.any(Array),
        category: expect.any(Array),
      }),
    );

    expect(articleService.findAll().length).toEqual(originalLengthMockData + 1);
  });

  test(`findOne, find random mock element`, () => {
    const searchlement = mockData[getRandomInt(0, mockData.length - 1)];
    const article = articleService.findOne(searchlement.id);
    expect(article).toStrictEqual(searchlement);
  });

  test(`update`, () => {
    const updatedArticle = {...mockData[0], title: `цэ измененый элемент`};
    const article = articleService.update(updatedArticle.id, {title: `цэ измененый элемент`});

    expect(article).toStrictEqual(updatedArticle);
  });

  test(`drop`, () => {
    const deleteArticle = {...mockData[0]};
    const originalLengthMockData = mockData.length;
    const article = articleService.drop(deleteArticle.id);

    expect(article).toStrictEqual([deleteArticle]);
    expect(articleService.findOne(deleteArticle.id)).toEqual(undefined);
    expect(articleService.findAll().length).toBe(originalLengthMockData - 1);
  });

});
