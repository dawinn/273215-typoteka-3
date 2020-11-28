'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
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

  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const [countUpdatedArticle] = await articleService.update(articleId, req.body);

    if (!countUpdatedArticle) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
    .json(countUpdatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article);

    res.status(HttpCode.OK)
    .json(comments);

  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    // todo задавать пользователя
    const comment = commentService.create(article, {text: req.body});

    return res.status(HttpCode.CREATED)
    .json(comment);
  });
};
