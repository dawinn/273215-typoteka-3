'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const {HttpCode} = require(`../../constants`);

let server;

beforeAll(async () => {
  server = await serverApi.initServer();
});

describe(`Categories API end-to-end tests`, () => {
  test(`When get article's categories list code should be 200`, async () => {

    const res = await request(server)
    .get(`/api/categories`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });
});
