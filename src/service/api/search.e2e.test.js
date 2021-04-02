'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const {HttpCode} = require(`../../constants`);
const {getRandomInt} = require(`../../utils`);

let server;
let articleAsMock;

const newArticle = {
  title: `Элемент поиска, дополнительный тест к продстроке поиска`,
  comments: [],
  announce: `Элемент поиска, дополнительный тест к продстроке поиска`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться и искать! Найти и... перепрятать Однажды тихой тёмной ночью... Или как-то раз мы с друзьями заблудились с пятнички на воскресенье Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. `,
  createdDate: `2020-03-18 15:07:18`,
  category: [{
    id: 377,
    name: `Деревья`,
  }],
  picture: `item11.jpg`,
};

const addNewArticle = async () => {
  const res = await request(server)
  .post(`/api/articles/`)
  .send(newArticle);
  return JSON.parse(res.res.text);
};

beforeAll(async () => {
  server = await serverApi.initServer();
  articleAsMock = await addNewArticle();
});

describe(`Search API end-to-end tests`, () => {
  test(`When search exists title, code should be 200`, async () => {
    const fragmentTitleMock = `Элемент поиска`;
    const res = await request(server)
    .get(`/api/search?query=${encodeURI(fragmentTitleMock)}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When search non exists title, code should be 200`, async () => {
    const res = await request(server)
    .get(`/api/search?query=${encodeURI(`notExistTitle`)}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
