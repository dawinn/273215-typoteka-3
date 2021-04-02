'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemas = require(`../middlewares/schemas-validate`);
const articleExist = require(`../middlewares/article-exist`);
const articleValidator = require(`../middlewares/schemas-validator`)(schemas.article);
const commentValidator = require(`../middlewares/schemas-validator`)(schemas.comment);
const paramValidator = require(`../middlewares/param-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const data = await articleService.findAll({page, limit});
    res.status(HttpCode.OK).json(data);
  });

  route.get(`/:articleId`, paramValidator(`articleId`), async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
    .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
    .json(article);
  });

  route.put(`/:articleId`, [paramValidator(`articleId`), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const countUpdatedArticle = await articleService.update(articleId, req.body);

    if (!countUpdatedArticle) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
    .json(countUpdatedArticle);
  });

  route.delete(`/:articleId`, paramValidator(`articleId`), async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(article);
  });

  route.get(`/:articleId/comments`, [paramValidator(`articleId`), articleExist(articleService)], async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id);

    res.status(HttpCode.OK)
    .json(comments);

  });

  route.delete(`/:articleId/comments/:commentId`, [paramValidator(`articleId`), paramValidator(`commentId`), articleExist(articleService)], async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(article.id, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [paramValidator(`articleId`), articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    // todo задавать пользователя
    const {text} = req.body;
    const comment = await commentService.create(article.id, {text, userId: 1});

    return res.status(HttpCode.CREATED)
    .json(comment);
  });
};
