'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {check} = require(`express-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, check(`query`), async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const {articles: searchResult, ...othersParams} = await service.findAll(query);

    const searchStatus = searchResult.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
    .json({searchResult, othersParams});
  });
};
