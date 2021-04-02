'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const {HttpCode} = require(`../../constants`);

let server;

let articleAsMock;

const newArticle = {
  title: `Новый элемент`,
  comments: [],
  announce: `Аннотация к новому элементу, Аннотация к новому элементу`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться и искать! Найти и... перепрятать Однажды тихой тёмной ночью... Или как-то раз мы с друзьями заблудились с пятнички на воскресенье Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. `,
  createdDate: `2020-03-18 15:07:18`,
  category: [{
    id: 377,
    name: `Деревья`,
  }],
  picture: `item11.jpg`,
};

const incorrectNewArticle = {
  title: `Не корректный новый элемент`,
  comments: [],
  announce: `Аннотация к новому элементу`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться и искать! Найти и... перепрятать Однажды тихой тёмной ночью... Или как-то раз мы с друзьями заблудились с пятнички на воскресенье Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. `,
  createdDate: `2020-03-18 15:07:18`,
  picture: {
    background: `11`,
    image: `item11.jpg`,
    image2x: `item11@2x.jpg`
  },
};

const addNewArticle = async () => {
  const res = await request(server)
  .post(`/api/articles/`)
  .send(newArticle);
  return JSON.parse(res.res.text);
};

const addNewComment = async (articleId) => {
  const commentData = {text: `Новый комментарий`};
  const res = await request(server)
  .post(`/api/articles/${articleId}/comments`)
  .send(commentData);
  return JSON.parse(res.res.text);
}

beforeAll(async () => {
  server = await serverApi.initServer();
});

describe(`Article API end-to-end tests`, () => {
  test(`When get articles status code should be 200`, async () => {

    const res = await request(server)
    .get(`/api/articles`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When get article by ID, status code should be 200`, async () => {
    const articleId = 1;
    const res = await request(server)
    .get(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When get articleID is not exists, status code should be 404`, async () => {
    const articleId = 9999;
    const res = await request(server).get(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When add new article, status code should be 200`, async () => {
    const res = await request(server)
    .post(`/api/articles/`)
    .send(newArticle);

    expect(res.statusCode).toBe(HttpCode.CREATED);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
  });

  test(`When add incorrect article, status code should be 400 & article wasn't create`, async () => {
    const res = await request(server)
    .post(`/api/articles/`)
    .send(incorrectNewArticle);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`When update offer, status code should be 200`, async () => {
    const result = await request(server)
    .post(`/api/articles/`)
    .send(newArticle);
    const article = JSON.parse(result.res.text);
    const updatedArticle = {
      title: `цэ измененый элемент`,
      announce: newArticle.announce,
      fullText: newArticle.fullText,
    };

    const res = await request(server)
    .put(`/api/articles/${article.id}`)
    .send(updatedArticle);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When delete article, status code should be 200`, async () => {
    const result = await request(server)
    .post(`/api/articles/`)
    .send(newArticle);

    const articleId = JSON.parse(result.res.text).id;
    const res = await request(server)
    .delete(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.OK);

    const getDeletedOffer = await request(server).get(`/api/article/${articleId}`);

    expect(getDeletedOffer.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When delete not exists articleID, status code should be 404`, async () => {
    const articleId = 9999999;
    const res = await request(server)
    .del(`/api/articles/${articleId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`Test article's comments`, () => {
    beforeEach(async () => {
      server = await serverApi.initServer();
      articleAsMock = await addNewArticle();
    });

    test(`When get article's comments, status code should be 200`, async () => {
      const articleId = articleAsMock.id;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.OK);
    });

    test(`When get comments by nonexistent articleID, status code should be 404`, async () => {
      const articleId = articleAsMock.id + 100;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When get comments by incorrect articleID, status code should be 404`, async () => {
      const articleId = `noExistId`;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When add new article's comments, status code should be 200`, async () => {
      const articleId = articleAsMock.id;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server)
      .post(`/api/articles/${articleId}/comments`)
      .send(commentData);

      expect(res.statusCode).toBe(HttpCode.CREATED);
    });

    test(`When add incorrect new article's comments, status code should be 400`, async () => {
      const articleId = articleAsMock.id;
      const commentData = {comment: `Новый комментарий`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When add comment by incorrect articleID, status code should be 404`, async () => {
      const articleId = articleAsMock.id + 100;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete article's comment, status code should be 200`, async () => {
      const articleId = articleAsMock.id;
      const comment = await addNewComment(articleId);
      const commentId = comment.id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.OK);

      const comments = await request(server).get(`/api/articles/${articleId}/comments`);
      expect(comments.body.some((comm) => comm.id === commentId)).toBe(false);
    });

    test(`When delete article's comment by nonexistent comment's ID, status code should be 404`, async () => {
      const articleId = articleAsMock.id;
      const commentId = 909090909090;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete article's comment by incorrect comment's ID, status code should be 400`, async () => {
      const articleId = articleAsMock.id;
      const commentId = `noExistId`;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When delete article's comment with incorrect article ID, status code should be 400`, async () => {
      const articleId = `noExistId`;
      const comment = await addNewComment(articleAsMock.id);
      const commentId = comment.id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Delete article's comment when comment ID not link article ID, status code should be 404`, async () => {
      const articleId = articleAsMock.id - 1;
      const comment = await addNewComment(articleAsMock.id);
      const commentId = comment.id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

