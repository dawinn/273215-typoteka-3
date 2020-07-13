'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const getMockData = require(`../lib/get-mock-data`);
const {HttpCode} = require(`../../constants`);
const {getRandomInt} = require(`../../utils`);

let server;
let mockData;

beforeAll(async () => {
  server = await serverApi.initServer();
  mockData = await getMockData();
});

describe(`Categories API end-to-end tests`, () => {
  test(`When get article's categories list code should be 200`, async () => {

    const res = await request(server)
    .get(`/api/categories`);

    const indexOffer = getRandomInt(0, mockData.length - 1);
    const categoriesMock = mockData[indexOffer].category;
    const categoriesServer = res.body;

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(categoriesMock.every((category) => ~categoriesServer.indexOf(category))).toBe(true);
  });
});
