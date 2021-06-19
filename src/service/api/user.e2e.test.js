'use strict';
const request = require(`supertest`);
const serverApi = require(`../cli/server`);
const {nanoid} = require(`nanoid`);

const {HttpCode} = require(`../../constants`);

let server;
let commonUserData;

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

  test(`Try register user with incorrect data, code should be 400`, async () => {
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

describe(`Login API end-to-end tests`, () => {
  beforeAll(async () => {
    commonUserData = getNewUserData();
    await request(server)
    .post(`/api/user/`)
    .send(commonUserData);
  });

  test(`When correct login user, code should be 200`, async () => {
    const res = await request(server)
    .post(`/api/user/login`)
    .send({
      username: commonUserData.email,
      password: commonUserData.password,
    });

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When incorrect login user, code should be 403`, async () => {
    const res = await request(server)
    .post(`/api/user/login`)
    .send({
      username: `${nanoid(7)}@ali.com`,
      password: commonUserData.password,
    });

    expect(res.statusCode).toBe(HttpCode.FORBIDDEN);
  });

  test(`When incorrect password user, code should be 403`, async () => {
    const res = await request(server)
    .post(`/api/user/login`)
    .send({
      username: commonUserData.email,
      password: nanoid(6),
    });

    expect(res.statusCode).toBe(HttpCode.FORBIDDEN);
  });
});
