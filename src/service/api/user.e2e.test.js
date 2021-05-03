'use strict';
const request = require(`supertest`);
const serverApi = require(`../cli/server`);
const {nanoid} = require(`nanoid`);

const {HttpCode} = require(`../../constants`);

let server;

const getNewUserData = () => ({
  name: `Абдурахман`,
  surname: `Хаттаб`,
  email: `${nanoid(6)}@ali.com`,
  password: `ohmygod`,
  repeat: `ohmygod`,
  avatar: `avatar.jpg`,
});
beforeAll(async () => {
  server = await serverApi.initServer();
});

describe(`User API end-to-end tests`, () => {
  test(`When correct register user, code should be 201`, async () => {
    const res = await request(server)
    .post(`/api/user/`)
    .send(getNewUserData());

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Try register double user, code should be 400`, async () => {
    const userData = getNewUserData();
    await request(server)
    .post(`/api/user/`)
    .send(userData);

    const res = await request(server)
    .post(`/api/user/`)
    .send(userData);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Try register user with uncorrect data, code should be 400`, async () => {
    const userData = {
      ...getNewUserData(),
      repeat: `OMGOMGOM`
    };

    const res = await request(server)
    .post(`/api/user/`)
    .send(userData);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
