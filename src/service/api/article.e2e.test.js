'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const getMockData = require(`../lib/get-mock-data`);
const {HttpCode} = require(`../../constants`);

let server;
let mockData;

const newArticle = {
  title: `Новый элемент`,
  comments: [],
  announce: `Аннотация к новому элементу`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться и искать! Найти и... перепрятать Однажды тихой тёмной ночью... Или как-то раз мы с друзьями заблудились с пятнички на воскресенье Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. `,
  createdDate: `2020-03-18 15:07:18`,
  category: [`Деревья`],
  picture: {
    background: `11`,
    image: `item11.jpg`,
    image2x: `item11@2x.jpg`
  },
};

const incorrectNewArticle = {
  title: `Не корректный новый элемент`,
  comments: [],
  announce: `Аннотация к новому элементу`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться и искать! Найти и... перепрятать Однажды тихой тёмной ночью... Или как-то раз мы с друзьями заблудились с пятнички на воскресенье Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. `,
  createdDate: `2020-03-18 15:07:18`,
  category: [`Деревья`]
};

beforeAll(async () => {
  server = await serverApi.initServer();
  mockData = await getMockData();
});

describe(`Article API end-to-end tests`, () => {
  test(`When get offers status code should be 200`, async () => {

    const res = await request(server)
    .get(`/api/articles`);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockData);
  });

  test(`When get offer by ID, status code should be 200`, async () => {
    const articleId = mockData[0].id;
    const res = await request(server)
    .get(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockData[0]);
  });

  test(`When get offerID is not exists, status code should be 404`, async () => {
    const articleId = `noExistID`;
    const res = await request(server).get(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When add new offer, status code should be 200`, async () => {
    const res = await request(server)
    .post(`/api/articles/`)
    .send(newArticle);

    expect(res.statusCode).toBe(HttpCode.CREATED);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
  });

  test(`When add incorrect offer, status code should be 400`, async () => {
    const res = await request(server)
    .post(`/api/articles/`)
    .send(incorrectNewArticle);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`When update offer, status code should be 200`, async () => {
    const updatedArticle = {...mockData[0], title: `цэ измененый элемент`, sum: 55555};
    const res = await request(server)
    .put(`/api/articles/${mockData[0].id}`)
    .send(updatedArticle);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When delete offer, status code should be 200`, async () => {
    const articleId = mockData[0].id;
    const res = await request(server)
    .del(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.OK);

    const getDeletedArticle = await request(server).get(`/api/articles/${articleId}`);

    expect(getDeletedArticle.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When delete not exists offerID, status code should be 404`, async () => {
    const articleId = `noExistId`;
    const res = await request(server)
    .del(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`Test offer's comments`, () => {
    test(`When get offer's comments, status code should be 200`, async () => {
      const articleId = mockData[0].id;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(mockData[0].comments);
    });

    test(`When get comments by incorrect offerID, status code should be 404`, async () => {
      const articleId = `noExistId`;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When add new offer's comments, status code should be 200`, async () => {
      const articleId = mockData[0].id;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);
      const returnedComment = {...commentData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedComment);
    });

    test(`When add incorrect new offer's comments, status code should be 400`, async () => {
      const articleId = mockData[0].id;
      const commentData = {comment: `Новый комментарий`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When add comment by incorrect offerID, status code should be 404`, async () => {
      const articleId = `noExistId`;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete offer's comment, status code should be 200`, async () => {
      const articleId = mockData[0].id;
      const comment = mockData[0].comments[0];
      const commentId = comment.id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(comment);

      const comments = await request(server).get(`/api/articles/${articleId}/comments`);
      expect(comments.body.some(comm => comm.id === commentId)).toBe(false);
    });

    test(`When delete offer's comment by incorrect comment's ID, status code should be 404`, async () => {
      const articleId = mockData[0].id;
      const commentId = `noExistId`;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete offer's comment with incorrect offer ID, status code should be 404`, async () => {
      const articleId = `noExistId`;
      const commentId = mockData[0].comments[0].id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Delete offer's comment when comment ID not link offer ID, status code should be 404`, async () => {
      const articleId = mockData[0].id;
      const comment = mockData[1].comments[0];
      const commentId = comment.id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

